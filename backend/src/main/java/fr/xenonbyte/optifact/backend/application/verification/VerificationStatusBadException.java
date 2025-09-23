package fr.xenonbyte.optifact.backend.application.verification;

import fr.xenonbyte.optifact.backend.application.common.exception.BadException;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationStatus;
import fr.xenonbyte.optifact.backend.domain.verification.message.VerificationMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
public final class VerificationStatusBadException extends BadException {
    public VerificationStatusBadException(VerificationStatus status) {
        super(VerificationMessage.VERIFICATION_STATUS_BAD, status);
    }
}
