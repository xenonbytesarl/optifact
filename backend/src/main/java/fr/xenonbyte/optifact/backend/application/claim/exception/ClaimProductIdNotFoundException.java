package fr.xenonbyte.optifact.backend.application.claim.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
public final class ClaimProductIdNotFoundException extends NotFoundException {
    public ClaimProductIdNotFoundException(UUID productId) {
        super(ClaimMessage.CLAIM_PRODUCT_ID_NOT_FOUND, productId);
    }
}
