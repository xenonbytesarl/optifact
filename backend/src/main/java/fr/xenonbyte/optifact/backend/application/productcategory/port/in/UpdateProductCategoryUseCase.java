package fr.xenonbyte.optifact.backend.application.productcategory.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface UpdateProductCategoryUseCase {
    ProductCategory updateProductCategory(UUID categoryId, ProductCategory productCategory);
}
