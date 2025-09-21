package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.exception.UserIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.user.port.in.CreateUserPasswordUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.PasswordManager;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;

import java.util.UUID;
import java.util.logging.Logger;


@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateUserPasswordApplicationService implements CreateUserPasswordUseCase {

    private static final Logger LOGGER = Logger.getLogger(CreateUserPasswordApplicationService.class.getName());

    private final UserRepository repository;
    private final PasswordManager passwordManager;

    public CreateUserPasswordApplicationService(UserRepository repository, PasswordManager passwordManager) {
        this.repository = repository;
        this.passwordManager = passwordManager;
    }

    @Override
    public void createUserPassword(UUID userId, String password, String confirmPassword, String verificationCode) {
        LOGGER.info("Setting user password (validation only in this minimal implementation)...");

        User user = repository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        //TODO fetch the verification code from database and check if it's valid(non expired, not already validated, useId matched)

        User.checkPassword(password, confirmPassword);

        password = passwordManager.encrypt(password);

        user = user.withPassword(password);

        repository.save(user);

        LOGGER.info("Password created successfully.");
    }
}
