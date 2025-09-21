package fr.xenonbyte.optifact.backend.application.user.port.out;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.SecondaryPort
public interface PasswordManager {
    String encrypt(String password);
}
