package fr.xenonbyte.optifact.backend.application.common.setting.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;

/**
 * Primary port: Find the first setting available in database
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface FindFirstSettingUseCase {
    Setting findFirstSetting();
}
