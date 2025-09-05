package fr.xenonbyte.optifact.backend.application.productcategory.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.message.ProductCategoryMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
public final class ProductCategoryIdNotFoundException extends NotFoundException {
    public ProductCategoryIdNotFoundException(UUID id) {
        super(ProductCategoryMessage.PRODUCT_CATEGORY_ID_NOT_FOUND, id);
    }
}
