package fr.xenonbyte.optifact.backend.application.product.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.product.product.message.ProductMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
public final class ProductIdNotFoundException extends NotFoundException {
    public ProductIdNotFoundException(UUID productId) {
        super(ProductMessage.PRODUCT_ID_NOT_FOUND, productId);
    }
}
