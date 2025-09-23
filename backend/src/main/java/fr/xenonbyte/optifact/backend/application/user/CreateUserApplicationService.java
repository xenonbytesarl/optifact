package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.exception.UserEmailConflictException;
import fr.xenonbyte.optifact.backend.application.user.port.in.CreateUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationType;

import java.time.ZonedDateTime;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateUserApplicationService implements CreateUserUseCase {

    private static final Logger LOGGER = Logger.getLogger(CreateUserApplicationService.class.getName());

    private final UserRepository repository;
    private final CreateVerificationUseCase createVerificationUseCase;

    public CreateUserApplicationService(UserRepository repository, CreateVerificationUseCase createVerificationUseCase) {
        this.repository = repository;
        this.createVerificationUseCase = createVerificationUseCase;
    }

    @Override
    public User createUser(User user) {
        LOGGER.info("Creating user...");

        if(repository.existsByEmail(user.getEmail())) {
            throw new UserEmailConflictException(user.getEmail());
        }


        User saved = repository.save(user);
        LOGGER.info("User created successfully with id: '" + saved.getId() + "'");

        Verification verification = Verification.create(saved.getId(), null, null, VerificationType.LINK, ZonedDateTime.now().plusDays(User.ACTIVATE_ACCOUNT_CODE_DURATION_DAY));
        verification = createVerificationUseCase.createVerification(verification);
        //TODO create and send account activation link
        return saved;
    }
}
