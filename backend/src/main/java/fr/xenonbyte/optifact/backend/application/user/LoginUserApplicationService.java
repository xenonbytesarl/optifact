package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindFirstSettingUseCase;
import fr.xenonbyte.optifact.backend.application.notification.ports.in.SendEmailUseCase;
import fr.xenonbyte.optifact.backend.application.user.payload.AuthResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.LoginResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.MfaResponse;
import fr.xenonbyte.optifact.backend.application.user.port.in.LoginUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.AuthenticationGateway;
import fr.xenonbyte.optifact.backend.application.user.port.out.TokenProvider;
import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
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
public final class LoginUserApplicationService implements LoginUserUseCase {

    private static final Logger LOGGER = Logger.getLogger(LoginUserApplicationService.class.getName());

    private final AuthenticationGateway gateway;
    private final TokenProvider tokenProvider;
    private final CreateVerificationUseCase createVerificationUseCase;
    private final SendEmailUseCase sendEmailUseCase;
    private final FindFirstSettingUseCase findFirstSettingUseCase;

    public LoginUserApplicationService(
            AuthenticationGateway gateway,
            TokenProvider tokenProvider,
            CreateVerificationUseCase createVerificationUseCase,
            SendEmailUseCase sendEmailUseCase,
            FindFirstSettingUseCase findFirstSettingUseCase) {
        this.gateway = gateway;
        this.tokenProvider = tokenProvider;
        this.createVerificationUseCase = createVerificationUseCase;
        this.sendEmailUseCase = sendEmailUseCase;
        this.findFirstSettingUseCase = findFirstSettingUseCase;
    }

    @Override
    public AuthResponse login(String email, String password) {
        LOGGER.info("Logging user with email: '" + email + "'");

        User user  = gateway.login(email, password);

        if (user.getMfaEnabled()) {
            Setting setting = findFirstSettingUseCase.findFirstSetting();

            Verification verification = getVerification(email, user, setting);

            Map<String, Object> model = buildEmailModel(user, verification);

            sendEmail(setting, user, model);

            return new MfaResponse(true, email);

        } else {
            String accessToken = tokenProvider.generateAccessToken(user);
            String refreshToken = tokenProvider.generateRefreshToken(user);
            LOGGER.info("User logged successfully with email: '" + email + "'");
            return new LoginResponse(accessToken, refreshToken);
        }

    }

    private Verification getVerification(String email, User user, Setting setting) {
        Verification verification = Verification.create(
                user.getId(),
                setting.getId(),
                null,
                VerificationType.CODE,
                ZonedDateTime.now().plusMinutes(User.MFA_CODE_DURATION_MINUTE)
        );
        verification = createVerificationUseCase.createVerification(verification);
        LOGGER.info("Verification code created for email: '" + email + "'");
        return verification;
    }

    private void sendEmail(Setting setting, User user, Map<String, Object> model) {
        // Resolve server and send asynchronously
        EmailServer server = setting.getEmailServer();
        String recipient = user.getEmail();

        CompletableFuture.runAsync(() -> {
            try {
                sendEmailUseCase.send(
                        "email/mfa-code",
                        model,
                        List.of(recipient),
                        "Votre code de sécurité",
                        server
                );
                LOGGER.info("MFA code email dispatch queued to '" + recipient + "'");
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed to send MFA code email asynchronously", e);
            }
        });
    }

    private static Map<String, Object> buildEmailModel(User user, Verification verification) {
        // Build email model for MFA code template
        Map<String, Object> model = new HashMap<>();
        model.put("applicationName", "COSUMAF");
        model.put("name", user.getFullName());
        model.put("code", verification.getCode());
        model.put("duration", User.MFA_CODE_DURATION_MINUTE + " minutes");
        return model;
    }
}
