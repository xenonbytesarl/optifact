package fr.xenonbyte.optifact.backend.infrastructure.productcategory;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.productcategory.port.out.ProductCategoryRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public class ProductCategoryRepositoryAdapterJpa implements ProductCategoryRepository {

    private final ProductCategoryRepositoryJpa repositoryJpa;
    private final ProductCategoryMapperJpa mapperJpa;

    public ProductCategoryRepositoryAdapterJpa(ProductCategoryRepositoryJpa repositoryJpa, ProductCategoryMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }

    @Override
    public ProductCategory save(ProductCategory productCategory) {
        return mapperJpa.toDomain(mapperJpa.toJpa(productCategory));
    }

    @Override
    public Optional<ProductCategory> findById(UUID categoryId) {
        return repositoryJpa.findById(categoryId).map(mapperJpa::toDomain);
    }

    @Override
    public Pagination<ProductCategory> search(String nameFilter, CommonSearch search) {
        Specification<ProductCategoryJpa> spec = (root, query, cb) -> cb.conjunction();

        spec =  addNativeStringFilter(nameFilter, spec);

        Sort sort = Sort.by(search.direction().equals(Direction.ASC) ? Sort.Direction.ASC: Sort.Direction.DESC, "name");

        PageRequest pageRequest = PageRequest.of(search.page().intValue(), search.size().intValue(), sort);

        Page<ProductCategoryJpa> productCategoryJpaPage = repositoryJpa.findAll(spec, pageRequest);
        List<ProductCategory> productCategories = productCategoryJpaPage.getContent().stream().map(mapperJpa::toDomain).toList();
        return Pagination.create(
               productCategories,
               productCategoryJpaPage.getTotalPages(),
               productCategoryJpaPage.getTotalElements(),
               search.page(),
               search.size(),
               !productCategoryJpaPage.hasNext(),
               !productCategoryJpaPage.hasPrevious()
        );
    }

    private Specification<ProductCategoryJpa> addNativeStringFilter(String value, Specification<ProductCategoryJpa> spec) {

        if(value != null && !value.isBlank()) {
            spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + value.toLowerCase() + "%"));
        }
        return spec;
    }

    @Override
    public Boolean existByName(String name) {
        return repositoryJpa.existsByNameEqualsIgnoreCase(name);
    }

    @Override
    public Boolean existByNameExcludingId(String name, UUID categoryId) {
        return repositoryJpa.existsByNameEqualsIgnoreCaseAndIdNot(name, categoryId);
    }

    @Override
    public Boolean existById(UUID categoryId) {
        return repositoryJpa.existsById(categoryId);
    }

    @Override
    public void delete(ProductCategory productCategory) {
        repositoryJpa.delete(mapperJpa.toJpa(productCategory));
    }
}
