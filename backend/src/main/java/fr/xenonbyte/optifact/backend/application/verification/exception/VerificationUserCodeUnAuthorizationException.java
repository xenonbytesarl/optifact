package fr.xenonbyte.optifact.backend.application.verification.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.UnAuthorizeException;
import fr.xenonbyte.optifact.backend.domain.verification.message.VerificationMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 23/09/2025
 */
public final class VerificationUserCodeUnAuthorizationException extends UnAuthorizeException {
    public VerificationUserCodeUnAuthorizationException(UUID userId) {
        super(VerificationMessage.VERIFICATION_USER_ID_NOT_FOUND, userId);
    }
}
