package fr.xenonbyte.optifact.backend.application.common.setting;

import fr.xenonbyte.optifact.backend.application.common.setting.exception.SettingIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.VerifyMailServerUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.out.SettingRepository;
import fr.xenonbyte.optifact.backend.application.notification.ports.in.SendEmailUseCase;
import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationType;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
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
    private final SendEmailUseCase sendEmailUseCase;

    public VerifyMailServerApplicationService(SettingRepository repository, CreateVerificationUseCase createVerificationUseCase, SendEmailUseCase sendEmailUseCase) {
        this.repository = repository;
        this.createVerificationUseCase = createVerificationUseCase;
        this.sendEmailUseCase = sendEmailUseCase;
    }

    @Override
    public Setting verifyMailServer(UUID settingId) {
        LOGGER.info("Starting mail server verification flow...");

        Setting setting = repository.findById(settingId)
                .orElseThrow(() -> new SettingIdNotFoundException(settingId));

        // Create verification with expiration
        Verification verification = Verification.create(null, settingId, null, VerificationType.LINK,
                ZonedDateTime.now().plusMinutes(Setting.DEFAULT_MAIL_SERVER_CODE_DURATION_LENGTH));

        verification = createVerificationUseCase.createVerification(verification);

        // Prepare and (asynchronously) dispatch the verification email if we can resolve a recipient
        EmailServer server = setting.getEmailServer();
        String recipient = server.getUsername();
        if (recipient != null) {
            Map<String, Object> model = buildEmailModel(setting, verification);
            final EmailServer mailServer = server;
            CompletableFuture.runAsync(() -> {
                try {
                    sendEmailUseCase.send(
                            "email/server-code",
                            model,
                            List.of(recipient),
                            "Code de vérification",
                            mailServer
                    );
                    LOGGER.info("Verification email dispatch queued to '" + recipient + "'");
                } catch (Exception e) {
                    LOGGER.log(Level.SEVERE, "Failed to send verification email asynchronously", e);
                }
            });
        } else {
            LOGGER.warning("No recipient email found to send verification code for setting '" + settingId + "'");
        }

        // Update setting state to waiting for mail server verification
        Setting updated = repository.save(setting.waitingMailServer());
        LOGGER.info("Mail server verification initiated; setting marked as waiting. id='" + settingId + "'");
        return updated;
    }

    private static Map<String, Object> buildEmailModel(Setting setting, Verification verification) {
        Map<String, Object> variables = new HashMap<>();
        String companyName = (setting.getCompany() != null) ? setting.getCompany().getName() : null;
        variables.put("emailTitle", "Code de vérification");
        variables.put("code", verification.getCode());
        variables.put("duration", Setting.DEFAULT_MAIL_SERVER_CODE_DURATION_LENGTH);
        if (companyName != null && !companyName.isBlank()) {
            variables.put("companyName", companyName);
            variables.put("supportTeamName", "L’équipe " + companyName);
        } else {
            variables.put("supportTeamName", "L’équipe support");
        }
        return Map.copyOf(variables);
    }
}
