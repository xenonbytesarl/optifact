package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.port.in.FindRolesUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.RoleRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.Role;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindRolesApplicationService implements FindRolesUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindRolesApplicationService.class.getName());

    private final RoleRepository repository;

    public FindRolesApplicationService(RoleRepository repository) {
        this.repository = repository;
    }

    @Override
    public Set<Role> findRoles() {
        LOGGER.info("Finding roles...");
        Set<Role> roles = repository.findRoles();
        LOGGER.info("Roles found successfully...");
        return roles;
    }

}
