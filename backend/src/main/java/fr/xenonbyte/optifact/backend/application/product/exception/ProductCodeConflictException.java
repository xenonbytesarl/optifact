package fr.xenonbyte.optifact.backend.application.product.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.domain.product.product.message.ProductMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
public final class ProductCodeConflictException extends ConflictException {
    public ProductCodeConflictException(String code) {
        super(ProductMessage.PRODUCT_CODE_CONFLICT, code);
    }
}
