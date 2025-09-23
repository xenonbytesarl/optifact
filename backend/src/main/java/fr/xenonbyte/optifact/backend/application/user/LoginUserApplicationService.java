package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.payload.AuthResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.LoginResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.MfaResponse;
import fr.xenonbyte.optifact.backend.application.user.port.in.LoginUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.AuthenticationGateway;
import fr.xenonbyte.optifact.backend.application.user.port.out.TokenProvider;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;

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

    public LoginUserApplicationService(AuthenticationGateway gateway, TokenProvider tokenProvider) {
        this.gateway = gateway;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public AuthResponse login(String username, String password) {
        LOGGER.info("Logging user with username: '" + username + "'");

        User user  = gateway.login(username, password);

        if(user.getMfaEnabled()) {
            //TODO generate and save verification code
            LOGGER.info("Verification code create for username: '" + username + "'");
            return new MfaResponse(true, username);

        } else {
            String accessToken = tokenProvider.generateAccessToken(user);
            String refreshToken = tokenProvider.generateRefreshToken(user);
            LOGGER.info("User logged successfully with username: '" + username + "'");
            return new LoginResponse(accessToken, refreshToken);
        }

    }
}
