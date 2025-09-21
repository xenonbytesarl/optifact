package fr.xenonbyte.optifact.backend.application.user.port.out;

import fr.xenonbyte.optifact.backend.domain.user.User;

/**
 * @author bamk
 * @version 1.0
 * @since 23/09/2025
 */
public interface TokenProvider {
    String generateAccessToken(User user);

    String generateRefreshToken(User user);
}
