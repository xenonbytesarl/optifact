package fr.xenonbyte.optifact.backend.application.common.setting;

import fr.xenonbyte.optifact.backend.application.common.setting.exception.SettingEmailServerAlreadyConfirmedBadException;
import fr.xenonbyte.optifact.backend.application.common.setting.exception.SettingIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.ValidateMailServerUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.out.SettingRepository;
import fr.xenonbyte.optifact.backend.application.verification.port.in.VerifiedVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;

import java.util.Locale;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class ValidateMailServerApplicationService implements ValidateMailServerUseCase {

    private static final Logger LOGGER = Logger.getLogger(ValidateMailServerApplicationService.class.getName());

    private final SettingRepository repository;
    private final VerifiedVerificationUseCase verifiedVerificationUseCase;

    public ValidateMailServerApplicationService(SettingRepository repository, VerifiedVerificationUseCase verifiedVerificationUseCase) {
        this.repository = repository;
        this.verifiedVerificationUseCase = verifiedVerificationUseCase;
    }


    @Override
    public Setting validateMailServer(UUID settingId, String code) {
        LOGGER.info("Validating mail server...");

        Setting setting = repository.findById(settingId)
                .orElseThrow(() -> new SettingIdNotFoundException(settingId));

        if(setting.emailServerIsConfirmed()) {
            throw new SettingEmailServerAlreadyConfirmedBadException();
        }

        verifiedVerificationUseCase.verifyServerCode(settingId, code);

        setting = setting.confirmMailServer();
        setting = repository.save(setting);
        LOGGER.info("Mail server validated successfully with id: '" + settingId + "'");
        return setting;
    }
}
