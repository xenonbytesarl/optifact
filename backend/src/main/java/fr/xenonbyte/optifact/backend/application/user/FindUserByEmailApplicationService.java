package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.exception.UserEmailNotFoundException;
import fr.xenonbyte.optifact.backend.application.user.exception.UserIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindUserByEmailUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindUserByIdUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindUserByEmailApplicationService implements FindUserByEmailUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindUserByEmailApplicationService.class.getName());

    private final UserRepository repository;

    public FindUserByEmailApplicationService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public User findByEmail(String email) {
        LOGGER.info("Finding user by email: '" + email + "'");
        User user = repository.findByEmail(email).orElseThrow(() -> new UserEmailNotFoundException(email));
        LOGGER.info("User found successfully with id: '" + email + "'");
        return user;
    }

}
