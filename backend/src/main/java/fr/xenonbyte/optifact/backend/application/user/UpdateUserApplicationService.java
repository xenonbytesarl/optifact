package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.exception.UserEmailConflictException;
import fr.xenonbyte.optifact.backend.application.user.exception.UserIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.user.port.in.UpdateUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;

import java.util.UUID;
import java.util.logging.Logger;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class UpdateUserApplicationService implements UpdateUserUseCase {

    private static final Logger LOGGER = Logger.getLogger(UpdateUserApplicationService.class.getName());

    private final UserRepository repository;

    public UpdateUserApplicationService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public User updateUser(UUID userId, User user) {
        LOGGER.info("Updating user with id: '" + userId + "'...");

        User current = repository.findById(userId)
                .orElseThrow(() -> new UserIdNotFoundException(userId));

        if(repository.existByEmailExcludingId(user.getEmail(), userId)) {
            throw new UserEmailConflictException(user.getEmail());
        }

        User updated = current.update(
                user.getFirstname(),
                user.getLastname(),
                user.getEmail(),
                user.getPhone(),
                user.getActorId(),
                user.getRoles()
        );

        User saved = repository.save(updated);
        LOGGER.info("User updated successfully with id: '" + saved.getId() + "'");
        return saved;
    }
}
