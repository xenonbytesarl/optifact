package fr.xenonbyte.optifact.backend.application.common.setting.exception;

import fr.xenonbyte.optifact.backend.api.common.setting.SettingMessageView;
import fr.xenonbyte.optifact.backend.application.common.exception.BadException;
import fr.xenonbyte.optifact.backend.domain.message.SettingMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
public final class SettingEmailServerAlreadyConfirmedBadException extends BadException {
    public SettingEmailServerAlreadyConfirmedBadException() {
        super(SettingMessage.SETTING_EMAIL_SERVER_ALREADY_CONFIRMED);
    }
}
