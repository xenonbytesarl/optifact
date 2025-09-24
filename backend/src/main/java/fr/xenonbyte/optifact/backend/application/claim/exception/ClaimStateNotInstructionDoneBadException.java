package fr.xenonbyte.optifact.backend.application.claim.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.BadException;
import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
public final class ClaimStateNotInstructionDoneBadException extends BadException {
    public ClaimStateNotInstructionDoneBadException() {
        super(ClaimMessage.CLAIM_STATE_NOT_INSTRUCTION_DONE);
    }
}
