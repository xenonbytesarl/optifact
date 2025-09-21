package fr.xenonbyte.optifact.backend.application.user.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.user.message.UserMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
public final class UserEmailConflictException extends NotFoundException {
    public UserEmailConflictException(String email) {
        super(UserMessage.USER_EMAIL_CONFLICT, email);
    }
}
