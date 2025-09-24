package fr.xenonbyte.optifact.backend.application.user.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.BadException;
import fr.xenonbyte.optifact.backend.domain.user.message.UserMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
public final class UserAccountAlreadyEnabledBadException extends BadException {
    public UserAccountAlreadyEnabledBadException() {
        super(UserMessage.USER_ACCOUNT_ALREADY_ENABLED);
    }
}
