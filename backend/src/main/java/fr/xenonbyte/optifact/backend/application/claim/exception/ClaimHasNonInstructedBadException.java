package fr.xenonbyte.optifact.backend.application.claim.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.BadException;
import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
public final class ClaimHasNonInstructedBadException extends BadException {
    public ClaimHasNonInstructedBadException(UUID claimId) {
        super(ClaimMessage.CLAIM_HAS_NON_INSTRUCTED, claimId);
    }
}
