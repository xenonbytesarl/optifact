package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.payload.LoginResponse;
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
public final class LoginApplicationService implements LoginUserUseCase {

    private static final Logger LOGGER = Logger.getLogger(LoginApplicationService.class.getName());

    private final AuthenticationGateway gateway;
    private final TokenProvider tokenProvider;

    public LoginApplicationService(AuthenticationGateway gateway, TokenProvider tokenProvider) {
        this.gateway = gateway;
        this.tokenProvider = tokenProvider;
    }

    @Override
    public LoginResponse login(String username, String password) {
        LOGGER.info("Logging user with username: '" + username + "'");

        User user  = gateway.login(username, password);

        LOGGER.info("User logged successfully with username: '" + username + "'");

        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);

        return new LoginResponse(accessToken, refreshToken);
    }
}
