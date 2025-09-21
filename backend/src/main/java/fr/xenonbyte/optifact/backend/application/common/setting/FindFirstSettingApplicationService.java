package fr.xenonbyte.optifact.backend.application.common.setting;

import fr.xenonbyte.optifact.backend.application.common.setting.exception.SettingNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindFirstSettingUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.out.SettingRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;

import java.util.logging.Logger;

/**
 * Application service to retrieve the first Setting found in database
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindFirstSettingApplicationService implements FindFirstSettingUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindFirstSettingApplicationService.class.getName());

    private final SettingRepository repository;

    public FindFirstSettingApplicationService(SettingRepository repository) {
        this.repository = repository;
    }

    @Override
    public Setting findFirstSetting() {
        LOGGER.info("Finding first setting in database...");
        return repository.findFirst().orElseThrow(SettingNotFoundException::new);
    }
}
