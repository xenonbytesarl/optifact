package fr.xenonbyte.optifact.backend.infrastructure.product;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;
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
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public final class ProductRepositoryAdapterJpa implements ProductRepository {

    private final ProductRepositoryJpa repositoryJpa;
    private final ProductMapperJpa mapperJpa;

    public ProductRepositoryAdapterJpa(ProductRepositoryJpa repositoryJpa, ProductMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }


    @Override
    public Product save(Product product) {
        return mapperJpa.toDomain(repositoryJpa.save(mapperJpa.toJpa(product)));
    }

    @Override
    public Optional<Product> findById(UUID categoryId) {
        return repositoryJpa.findById(categoryId).map(mapperJpa::toDomain);
    }

    @Override
    public Pagination<Product> search(String nameFilter, String codeFilter, String categoryNameFilter, String typeFilter, CommonSearch search) {
        Specification<ProductJpa> spec = (root, query, cb) -> cb.conjunction();

        spec =  addNativeStringFilter(nameFilter, "name", spec);
        spec =  addNativeStringFilter(codeFilter, "code", spec);
        spec =  addManyToOneFilter(categoryNameFilter, "category", spec);
        spec =  addNativeStringFilter(typeFilter, "type", spec);


        Sort sort = parseSort(search.sort(), search.direction());

        PageRequest pageRequest = PageRequest.of(search.page().intValue(), search.size().intValue(), sort);

        Page<ProductJpa> productJpaPage = repositoryJpa.findAll(spec, pageRequest);
        List<Product> products = productJpaPage.getContent().stream().map(mapperJpa::toDomain).toList();
        return Pagination.create(
                products,
                productJpaPage.getTotalPages(),
                productJpaPage.getTotalElements(),
                search.page(),
                search.size(),
                !productJpaPage.hasNext(),
                !productJpaPage.hasPrevious()
        );
    }

    private Sort parseSort(String field, Direction direction) {
        if (field == null || field.isBlank() || direction == null) {
            // The default sort is by ID ascending
            return Sort.by(Sort.Direction.ASC, "id");
        }

        Sort.Direction sort = "DESC".equalsIgnoreCase(direction.name())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        // Map the property name to the corresponding field name in the JPA entity
        String fieldName = switch (field) {
            case "name", "code", "type" -> field;
            case "description" -> "description";
            case "createdAt" -> "createdAt";
            case "updatedAt" -> "updatedAt";
            default -> "id";
        };

        return Sort.by(sort, fieldName);
    }

    private Specification<ProductJpa> addNativeStringFilter(String value, String field, Specification<ProductJpa> spec) {

        if(value != null && !value.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get(field)), "%" + value.toLowerCase() + "%"));
        }
        return spec;
    }

    private static Specification<ProductJpa> addManyToOneFilter(String value, String field, Specification<ProductJpa> spec) {
        // Add product category name filter if provided
        if (value != null && !value.isEmpty()) {
            // This requires joining with the ProductCategory table
            spec = spec.and((root, query, cb) -> {
                // Join with the ProductCategory table
                var categoryJoin = root.join(field);
                // Filter by category name
                return cb.like(cb.lower(categoryJoin.get("name")), "%" + value.toLowerCase() + "%");
            });
        }
        return spec;
    }

    @Override
    public Boolean existByName(String name) {
        return repositoryJpa.existsByNameEqualsIgnoreCase(name);
    }

    @Override
    public Boolean existByCode(String code) {
        return repositoryJpa.existsByCodeEqualsIgnoreCase(code);
    }

    @Override
    public Boolean existById(UUID categoryId) {
        return repositoryJpa.existsById(categoryId);
    }

    @Override
    public Boolean existByNameExcludingId(String name, UUID categoryId) {
        return repositoryJpa.existsByNameEqualsIgnoreCaseAndIdNot(name, categoryId);
    }

    @Override
    public Boolean existByCodeExcludingId(String code, UUID productId) {
        return repositoryJpa.existsByCodeEqualsIgnoreCaseAndIdNot(code, productId);
    }

    @Override
    public void delete(Product product) {
        repositoryJpa.delete(mapperJpa.toJpa(product));
    }

    @Override
    public boolean existsById(UUID productId) {
        return repositoryJpa.existsById(productId);
    }
}
