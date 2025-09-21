package fr.xenonbyte.optifact.backend.application.user.port.out;

import fr.xenonbyte.optifact.backend.domain.user.User;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
public interface AuthenticationGateway {
    User login(String username, String password);
}
