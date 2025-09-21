package fr.xenonbyte.optifact.backend.application.user.port.out;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.Role;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.Repository
@Hexagonal.SecondaryPort
public interface RoleRepository {
    Set<Role> findRoles();
}
