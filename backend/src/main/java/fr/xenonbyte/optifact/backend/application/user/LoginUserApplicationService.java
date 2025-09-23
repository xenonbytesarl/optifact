package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.payload.AuthResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.LoginResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.MfaResponse;
import fr.xenonbyte.optifact.backend.application.user.port.in.LoginUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.AuthenticationGateway;
import fr.xenonbyte.optifact.backend.application.user.port.out.TokenProvider;
import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationType;

import java.time.ZonedDateTime;
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

    public LoginUserApplicationService(
            AuthenticationGateway gateway,
            TokenProvider tokenProvider,
            CreateVerificationUseCase createVerificationUseCase) {
        this.gateway = gateway;
        this.tokenProvider = tokenProvider;
        this.createVerificationUseCase = createVerificationUseCase;
    }

    @Override
    public AuthResponse login(String email, String password) {
        LOGGER.info("Logging user with email: '" + email + "'");

        User user  = gateway.login(email, password);

        if(user.getMfaEnabled()) {
            Verification verification = Verification.create(user.getId(), null, null, VerificationType.CODE, ZonedDateTime.now().plusMinutes(User.MFA_CODE_DURATION_MINUTE));
            createVerificationUseCase.createVerification(verification);
            LOGGER.info("Verification code create for email: '" + email + "'");
            return new MfaResponse(true, email);

        } else {
            String accessToken = tokenProvider.generateAccessToken(user);
            String refreshToken = tokenProvider.generateRefreshToken(user);
            LOGGER.info("User logged successfully with email: '" + email + "'");
            return new LoginResponse(accessToken, refreshToken);
        }

    }
}
