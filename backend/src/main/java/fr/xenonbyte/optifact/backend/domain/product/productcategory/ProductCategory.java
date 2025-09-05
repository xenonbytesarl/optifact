package fr.xenonbyte.optifact.backend.domain.product.productcategory;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.message.ProductCategoryMessage;

import java.util.UUID;

import static java.util.UUID.randomUUID;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class ProductCategory extends BaseEntity {
    private final String name;
    private final Boolean active;

    public ProductCategory(UUID id, String name, Boolean active) {
        this.id = id;
        this.name = name;
        this.active = active;
    }

    public ProductCategory create(String name) {
        validateParam(name);
        return new ProductCategory(randomUUID(), name, true);
    }

    private void validateParam(String name) {
        if(name == null || name.isBlank()) {
            throw new IllegalArgumentException(ProductCategoryMessage.PRODUCT_CATEGORY_NAME_REQUIRED);
        }
    }

    public ProductCategory update(String name) {
        validateParam(name);
        ProductCategory productCategory = new ProductCategory(id, name, true);
        productCategory.updateAudit(createdAt);
        return productCategory;
    }

    public ProductCategory withActive(Boolean active) {
        ProductCategory productCategory = new ProductCategory(id, name, active);
        productCategory.updateAudit(createdAt);
        return productCategory;
    }

    public String getName() {
        return name;
    }
}
