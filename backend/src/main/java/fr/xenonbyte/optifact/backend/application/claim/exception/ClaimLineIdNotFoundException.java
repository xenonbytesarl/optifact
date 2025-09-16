package fr.xenonbyte.optifact.backend.application.claim.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
public final class ClaimLineIdNotFoundException extends NotFoundException {
    public ClaimLineIdNotFoundException(UUID claimLineId) {
        super(ClaimMessage.CLAIM_LINE_ID_NOT_FOUND, claimLineId);
    }
}
