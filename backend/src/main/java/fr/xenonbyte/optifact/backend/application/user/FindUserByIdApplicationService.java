package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.exception.UserIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindUserByIdUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;

import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindUserByIdApplicationService implements FindUserByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindUserByIdApplicationService.class.getName());

    private final UserRepository repository;

    public FindUserByIdApplicationService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public User findById(UUID id) {
        LOGGER.info("Finding user by id: '" + id + "'");
        User user = repository.findById(id).orElseThrow(() -> new UserIdNotFoundException(id));
        LOGGER.info("User found successfully with id: '" + id + "'");
        return user;
    }

}
