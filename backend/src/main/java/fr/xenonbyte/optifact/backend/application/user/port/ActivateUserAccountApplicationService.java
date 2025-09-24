package fr.xenonbyte.optifact.backend.application.user.port;

import fr.xenonbyte.optifact.backend.application.user.exception.UserAccountAlreadyEnabledBadException;
import fr.xenonbyte.optifact.backend.application.user.exception.UserIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.user.port.in.ActivateUserAccountUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.application.verification.port.in.VerifiedVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class ActivateUserAccountApplicationService implements ActivateUserAccountUseCase {

    private static final Logger LOGGER = Logger.getLogger(ActivateUserAccountApplicationService.class.getName());

    private final VerifiedVerificationUseCase verificationUseCase;
    private final UserRepository userRepository;

    public ActivateUserAccountApplicationService(VerifiedVerificationUseCase verificationUseCase, UserRepository userRepository) {
        this.verificationUseCase = verificationUseCase;
        this.userRepository = userRepository;
    }

    @Override
    public void activateUserAccount(UUID userId, String code) {
        LOGGER.info("Activating user account...");

        User user = userRepository.findById(userId).orElseThrow(() -> new UserIdNotFoundException(userId));

        if(user.getAccountEnabled()) {
            throw new UserAccountAlreadyEnabledBadException();
        }

        verificationUseCase.verifyUserCode(userId, code);

    user = user.activateAccount();
    userRepository.save(user);
    LOGGER.info("User account activated successfully with id: '" + userId + "'");
    }
}
