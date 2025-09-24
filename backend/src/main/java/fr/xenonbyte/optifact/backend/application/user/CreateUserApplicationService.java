package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindFirstSettingUseCase;
import fr.xenonbyte.optifact.backend.application.notification.ports.in.SendEmailUseCase;
import fr.xenonbyte.optifact.backend.application.user.exception.UserEmailConflictException;
import fr.xenonbyte.optifact.backend.application.user.port.in.CreateUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import fr.xenonbyte.optifact.backend.domain.user.User;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationType;
import fr.xenonbyte.optifact.backend.application.common.port.out.FrontendUrlProvider;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateUserApplicationService implements CreateUserUseCase {

    private static final Logger LOGGER = Logger.getLogger(CreateUserApplicationService.class.getName());

    private final UserRepository repository;
    private final CreateVerificationUseCase createVerificationUseCase;
    private final SendEmailUseCase sendEmailUseCase;
    private final FindFirstSettingUseCase findFirstSettingUseCase;

    private final FrontendUrlProvider frontendUrlProvider;

    public CreateUserApplicationService(
            UserRepository repository,
            CreateVerificationUseCase createVerificationUseCase,
            SendEmailUseCase sendEmailUseCase,
            FindFirstSettingUseCase findFirstSettingUseCase,
            FrontendUrlProvider frontendUrlProvider) {
        this.repository = repository;
        this.createVerificationUseCase = createVerificationUseCase;
        this.sendEmailUseCase = sendEmailUseCase;
        this.findFirstSettingUseCase = findFirstSettingUseCase;
        this.frontendUrlProvider = frontendUrlProvider;
    }

    @Override
    public User createUser(User user) {
        LOGGER.info("Creating user...");

        if(repository.existsByEmail(user.getEmail())) {
            throw new UserEmailConflictException(user.getEmail());
        }

        user.validateRoles();

        user = repository.save(user);
        LOGGER.info("User created successfully with id: '" + user.getId() + "'");

        Setting setting = findFirstSettingUseCase.findFirstSetting();

        Verification verification = getVerification(user, setting);


        sendEmail(user, setting, verification);

        return user;
    }

    private void sendEmail(User user, Setting setting, Verification verification) {
        EmailServer server = setting.getEmailServer();
        String recipient = user.getEmail();

        Map<String, Object> model = buildEmailModel(user, verification);

        CompletableFuture.runAsync(() -> {

            try {
                sendEmailUseCase.send(
                        "email/activate-account",
                        model,
                        List.of(recipient),
                        "Activez votre compte",
                        server
                );
                LOGGER.info("Verification email dispatch queued to '" + recipient + "'");
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed to send verification email asynchronously", e);
            }
        });
    }

    private Verification getVerification(User user, Setting setting) {
        Verification verification = Verification.create(user.getId(), setting.getId(), null, VerificationType.LINK, ZonedDateTime.now().plusDays(User.ACTIVATE_ACCOUNT_CODE_DURATION_DAY));
        verification = createVerificationUseCase.createVerification(verification);
        return verification;
    }

    private Map<String, Object> buildEmailModel(User user, Verification verification) {
        Map<String, Object> model = new HashMap<>();
        model.put("applicationName", "COSUMAF");
        model.put("name", user.getFullName() );
        model.put("duration", User.ACTIVATE_ACCOUNT_CODE_DURATION_DAY + " jours");
        model.put("activationLink", frontendUrlProvider.baseUrl() + "/users/activate/" + user.getId() + "/" + verification.getCode());
        return model;
    }
}
