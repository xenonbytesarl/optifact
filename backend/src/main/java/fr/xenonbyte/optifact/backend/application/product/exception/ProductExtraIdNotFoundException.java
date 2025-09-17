package fr.xenonbyte.optifact.backend.application.product.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.product.product.message.ProductMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
public final class ProductExtraIdNotFoundException extends NotFoundException {
    public ProductExtraIdNotFoundException(UUID productId) {
        super(ProductMessage.PRODUCT_EXTRA_ID_NOT_FOUND, productId);
    }
}
