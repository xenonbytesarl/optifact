package fr.xenonbyte.optifact.backend.application.common.setting;

import fr.xenonbyte.optifact.backend.application.common.setting.exception.SettingIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.VerifyMailServerUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.out.SettingRepository;
import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.MailServerState;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationType;

import java.time.ZonedDateTime;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class VerifyMailServerApplicationService implements VerifyMailServerUseCase {

    private static final Logger LOGGER = Logger.getLogger(VerifyMailServerApplicationService.class.getName());

    private final SettingRepository repository;
    private final CreateVerificationUseCase createVerificationUseCase;

    public VerifyMailServerApplicationService(SettingRepository repository, CreateVerificationUseCase createVerificationUseCase) {
        this.repository = repository;
        this.createVerificationUseCase = createVerificationUseCase;
    }

    @Override
    public Setting verifyMailServer(UUID settingId) {
        LOGGER.info("Verifying mail server...");

        Setting setting = repository.findById(settingId)
                .orElseThrow(() -> new SettingIdNotFoundException(settingId));

        Verification verification = Verification.create(null, settingId, null, VerificationType.LINK,
                ZonedDateTime.now().plusMinutes(Setting.DEFAULT_MAIL_SERVER_CODE_DURATION_LENGTH));

        createVerificationUseCase.createVerification(verification);

        LOGGER.info("Mail server verified successfully");

        setting = setting.waitingMailServer();

        setting = repository.save(setting);
        LOGGER.info("Mail server waiting successfully with id: '" + settingId + "'");
        return setting;
    }
}
