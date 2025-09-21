package fr.xenonbyte.optifact.backend.application.common.setting;

import fr.xenonbyte.optifact.backend.application.common.setting.exception.SettingIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.UpdateSettingUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.out.SettingRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;

import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class UpdateSettingApplicationService implements UpdateSettingUseCase {

    private static final Logger LOGGER = Logger.getLogger(UpdateSettingApplicationService.class.getName());

    private final SettingRepository repository;

    public UpdateSettingApplicationService(SettingRepository repository) {
        this.repository = repository;
    }

    @Override
    public Setting updateSetting(UUID settingId, Setting setting) {
        LOGGER.info("Updating setting '" + settingId + "'...");
        Optional<Setting> optionalSetting = repository.findById(settingId);
        if(optionalSetting.isEmpty()) {
            throw new SettingIdNotFoundException(settingId);
        }

        Setting existing = optionalSetting.get();

        existing = existing.with(setting.getCompany(), setting.getEmailServer());

        Setting updated = repository.save(existing);
        LOGGER.info("Setting updated successfully with id: '" + updated.getId() + "'");
        return updated;
    }
}
