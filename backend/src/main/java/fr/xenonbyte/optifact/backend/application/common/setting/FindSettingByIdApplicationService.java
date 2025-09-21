package fr.xenonbyte.optifact.backend.application.common.setting;

import fr.xenonbyte.optifact.backend.application.common.setting.exception.SettingIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindSettingByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.out.SettingRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindSettingByIdApplicationService implements FindSettingByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindSettingByIdApplicationService.class.getName());

    private final SettingRepository repository;

    public FindSettingByIdApplicationService(SettingRepository repository) {
        this.repository = repository;
    }

    @Override
    public Setting findSettingById(UUID settingId) {
        LOGGER.info("Finding setting by id: '" + settingId + "'...");
        return repository.findById(settingId)
                .orElseThrow(() -> new SettingIdNotFoundException(settingId));
    }
}
