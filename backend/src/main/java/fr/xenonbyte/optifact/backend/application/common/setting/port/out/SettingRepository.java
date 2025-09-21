package fr.xenonbyte.optifact.backend.application.common.setting.port.out;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;

import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.SecondaryPort
public interface SettingRepository {
    Setting save(Setting setting);
    Optional<Setting> findById(UUID settingId);
    Optional<Setting> findFirst();
    boolean existById(UUID settingId);
}
