package fr.xenonbyte.optifact.backend.application.user.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.user.message.UserMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
public final class UserIdNotFoundException extends NotFoundException {
    public UserIdNotFoundException(UUID userId) {
        super(UserMessage.USER_ID_NOT_FOUND, userId);
    }
}
