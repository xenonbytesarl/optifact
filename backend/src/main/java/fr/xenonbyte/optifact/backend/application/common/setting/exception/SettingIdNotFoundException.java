package fr.xenonbyte.optifact.backend.application.common.setting.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
public final class SettingIdNotFoundException extends NotFoundException {
    public SettingIdNotFoundException(UUID id) {
        super("Setting id not found: '" + id + "'");
    }
}
