package fr.xenonbyte.optifact.backend.infrastructure.security;

import fr.xenonbyte.optifact.backend.application.user.port.out.AuthenticationGateway;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter
public final class AuthenticationManagerAdapter implements AuthenticationGateway {

    private static final Logger LOGGER = Logger.getLogger(AuthenticationManagerAdapter.class.getName());

    private final AuthenticationManager authenticationManager;

    public AuthenticationManagerAdapter(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @Override
    public User login(String username, String password) {
        LOGGER.info("Logging user with username: '" + username + "'");
        // check if an account is brut force attacked
        Authentication authenticate = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
        LOGGER.info("User logged successfully with username: '" + username + "'");
        Object principal = authenticate.getPrincipal();
        if (principal instanceof CustomUserDetails cud) {
            return cud.getUser();
        }
        if (principal instanceof User u) {
            return u;
        }
        return null;
    }
}
