package fr.xenonbyte.optifact.backend.application.common.setting.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface ValidateMailServerUseCase {
    Setting validateMailServer(UUID settingId, String code);
}
