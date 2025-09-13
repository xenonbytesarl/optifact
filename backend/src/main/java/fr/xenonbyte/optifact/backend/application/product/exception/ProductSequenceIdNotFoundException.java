package fr.xenonbyte.optifact.backend.application.product.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.product.product.message.ProductMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
public final class ProductSequenceIdNotFoundException extends NotFoundException {
    public ProductSequenceIdNotFoundException(UUID sequenceId) {
        super(ProductMessage.PRODUCT_SEQUENCE_ID_NOT_FOUND, sequenceId);
    }
}
