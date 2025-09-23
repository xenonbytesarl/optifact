package fr.xenonbyte.optifact.backend.application.verification;

import fr.xenonbyte.optifact.backend.application.verification.exception.VerificationExpiredAtBadException;
import fr.xenonbyte.optifact.backend.application.verification.exception.VerificationUserCodeNotFound;
import fr.xenonbyte.optifact.backend.application.verification.port.in.VerifiedVerificationUseCase;
import fr.xenonbyte.optifact.backend.application.verification.port.out.VerificationRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationStatus;

import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 23/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class VerifiedVerificationApplicationService implements VerifiedVerificationUseCase {

    private static final Logger LOGGER = Logger.getLogger(VerifiedVerificationApplicationService.class.getName());

    private final VerificationRepository repository;

    public VerifiedVerificationApplicationService(VerificationRepository repository) {
        this.repository = repository;
    }

    @Override
    public void verifyUserCode(UUID userId, String code) {
        LOGGER.info("Verifying verification code...");

        Optional<Verification> optionalVerification = repository.findByCodeAndUserIdAndState(code, userId, VerificationStatus.PENDING);

        if(optionalVerification.isEmpty()) {
            throw new VerificationUserCodeNotFound(userId);
        }

        Verification verification = optionalVerification.get();

        if(verification.isExpired()) {
            throw new VerificationExpiredAtBadException(verification.getUserId());
        }

        verification = verification.verify();
        repository.save(verification);
        LOGGER.info("Verification code verified successfully with userId: '" + userId + "'");

    }
}
