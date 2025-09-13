package fr.xenonbyte.optifact.backend.application.claim.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
public final class ClaimReferenceConflictException extends ConflictException {
    public ClaimReferenceConflictException(String reference) {
        super(ClaimMessage.CLAIM_REFERENCE_CONFLICT, reference);
    }
}
