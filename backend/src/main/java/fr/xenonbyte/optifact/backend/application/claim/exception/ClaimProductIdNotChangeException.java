package fr.xenonbyte.optifact.backend.application.claim.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.BadException;
import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
public final class ClaimProductIdNotChangeException extends BadException {
    public ClaimProductIdNotChangeException(UUID productId) {
        super(ClaimMessage.CLAIM_PRODUCT_ID_NOT_CHANGE, productId);
    }
}
