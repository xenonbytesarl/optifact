package fr.xenonbyte.optifact.backend.application.productcategory.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.message.ProductCategoryMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
public final class ProductCategoryNameConflictException extends ConflictException {
    public ProductCategoryNameConflictException(String name) {
        super(ProductCategoryMessage.PRODUCT_CATEGORY_NAME_CONFLICT, name);
    }
}
