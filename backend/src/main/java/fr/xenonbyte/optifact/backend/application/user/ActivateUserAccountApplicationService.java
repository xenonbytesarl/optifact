package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindFirstSettingUseCase;
import fr.xenonbyte.optifact.backend.application.notification.ports.in.SendEmailUseCase;
import fr.xenonbyte.optifact.backend.application.user.exception.UserAccountAlreadyEnabledBadException;
import fr.xenonbyte.optifact.backend.application.user.exception.UserIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.user.port.in.ActivateUserAccountUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
import fr.xenonbyte.optifact.backend.application.verification.port.in.VerifiedVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import fr.xenonbyte.optifact.backend.domain.user.User;
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
public final class ActivateUserAccountApplicationService implements ActivateUserAccountUseCase {

    private static final Logger LOGGER = Logger.getLogger(ActivateUserAccountApplicationService.class.getName());

    private final VerifiedVerificationUseCase verificationUseCase;
    private final CreateVerificationUseCase createVerificationUseCase;
    private final SendEmailUseCase sendEmailUseCase;
    private final FindFirstSettingUseCase findFirstSettingUseCase;
    private final UserRepository userRepository;

    public ActivateUserAccountApplicationService(
            VerifiedVerificationUseCase verificationUseCase,
            CreateVerificationUseCase createVerificationUseCase,
            SendEmailUseCase sendEmailUseCase,
            FindFirstSettingUseCase findFirstSettingUseCase,
            UserRepository userRepository) {
        this.verificationUseCase = verificationUseCase;
        this.createVerificationUseCase = createVerificationUseCase;
        this.sendEmailUseCase = sendEmailUseCase;
        this.findFirstSettingUseCase = findFirstSettingUseCase;
        this.userRepository = userRepository;
    }

    @Override
    public void activateUserAccount(UUID userId, String code) {
        LOGGER.info("Activating user account...");

        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        if (user.getAccountEnabled()) {
            throw new UserAccountAlreadyEnabledBadException();
        }

        // Verify provided activation code
        verificationUseCase.verifyUserCode(userId, code);

        // Activate an account
        user = user.activateAccount();
        userRepository.save(user);
        LOGGER.info("User account activated successfully with id: '" + userId + "'");

        Setting setting = findFirstSettingUseCase.findFirstSetting();

        Verification createPwdVerification = getVerification(user, setting);

        Map<String, Object> model = buildEmailModel(user, createPwdVerification);

        sendEmail(setting, user, model);
    }

    private Verification getVerification(User user, Setting setting) {
        // Create verification for password creation
        Verification createPwdVerification = Verification.create(
                user.getId(),
                setting.getId(),
                null,
                VerificationType.LINK,
                ZonedDateTime.now().plusDays(User.CREATE_PASSWORD_CODE_DURATION_DAY)
        );
        createPwdVerification = createVerificationUseCase.createVerification(createPwdVerification);
        return createPwdVerification;
    }

    private void sendEmail(Setting setting, User user, Map<String, Object> model) {
        // Resolve email server and send email asynchronously
        EmailServer server = setting.getEmailServer();
        String recipient = user.getEmail();

        CompletableFuture.runAsync(() -> {
            try {
                sendEmailUseCase.send(
                        "email/create-password",
                        model,
                        List.of(recipient),
                        "Créez votre mot de passe",
                        server
                );
                LOGGER.info("Create-password email dispatch queued to '" + recipient + "'");
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed to send create-password email asynchronously", e);
            }
        });
    }

    private static Map<String, Object> buildEmailModel(User user, Verification createPwdVerification) {
        // Prepare email model for create-password template
        Map<String, Object> model = new HashMap<>();
        model.put("applicationName", "COSUMAF");
        model.put("name", user.getFullName());
        model.put("duration", User.CREATE_PASSWORD_CODE_DURATION_DAY + " jours");
        model.put("createPasswordLink", "/users/password/create/" + user.getId() + "/" + createPwdVerification.getCode());
        return model;
    }
}
