package fr.xenonbyte.optifact.backend.application.common.setting;

import fr.xenonbyte.optifact.backend.application.common.setting.exception.SettingIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.CreateSettingEmailServerPasswordUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.out.SettingRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateSettingEmailServerPasswordApplicationService implements CreateSettingEmailServerPasswordUseCase {


    private static final Logger LOGGER = Logger.getLogger(CreateSettingEmailServerPasswordApplicationService.class.getName());

    private final SettingRepository repository;

    public CreateSettingEmailServerPasswordApplicationService(SettingRepository repository) {
        this.repository = repository;
    }

    @Override
    public Setting createSettingEmailServerPassword(UUID settingId, String password) {
        LOGGER.info("Creating setting email server password...");

        Setting setting = repository.findById(settingId).orElseThrow(() -> new SettingIdNotFoundException(settingId));

        setting = setting.definePassword(password);

        setting = repository.save(setting);
        LOGGER.info("Setting email server password created successfully");
        return setting;
    }
}
