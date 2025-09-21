package fr.xenonbyte.optifact.backend.application.common.setting.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
public final class SettingNotFoundException extends NotFoundException {
    public SettingNotFoundException() {
        super("Setting not found");
    }
}
