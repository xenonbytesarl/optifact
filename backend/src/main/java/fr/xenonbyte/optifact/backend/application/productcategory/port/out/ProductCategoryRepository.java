package fr.xenonbyte.optifact.backend.application.productcategory.port.out;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;

import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.Repository
@Hexagonal.SecondaryPort
public interface ProductCategoryRepository {

    ProductCategory save(ProductCategory productCategory);

    Optional<ProductCategory> findById(UUID categoryId);

    Pagination<ProductCategory> search(String nameFilter, CommonSearch search);

    Boolean existByName(String name);

    Boolean existByNameExcludingId(String name, UUID categoryId);

    Boolean existById(UUID categoryId);

    void delete(ProductCategory productCategory);
}
