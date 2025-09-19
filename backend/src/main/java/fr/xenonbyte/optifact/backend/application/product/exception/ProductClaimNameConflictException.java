package fr.xenonbyte.optifact.backend.application.product.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.domain.product.product.message.ProductMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
public final class ProductClaimNameConflictException extends ConflictException {
    public ProductClaimNameConflictException(String name) {
        super(ProductMessage.PRODUCT_CLAIM_NAME_CONFLICT, name);
    }
}
