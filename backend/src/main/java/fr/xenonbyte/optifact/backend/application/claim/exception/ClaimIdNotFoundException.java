package fr.xenonbyte.optifact.backend.application.claim.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
public final class ClaimIdNotFoundException extends NotFoundException {
    public ClaimIdNotFoundException(UUID claimId) {
        super(ClaimMessage.CLAIM_ID_NOT_FOUND, claimId);
    }
}
