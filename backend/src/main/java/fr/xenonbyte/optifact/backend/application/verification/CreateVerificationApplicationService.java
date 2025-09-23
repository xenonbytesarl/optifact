package fr.xenonbyte.optifact.backend.application.verification;

import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
import fr.xenonbyte.optifact.backend.application.verification.port.out.VerificationRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.verification.CodeType;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationType;

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
public final class CreateVerificationApplicationService implements CreateVerificationUseCase {

    private static final Logger LOGGER = Logger.getLogger(CreateVerificationApplicationService.class.getName());

    private VerificationRepository repository;

    @Override
    public Verification create(Verification verification) {
        LOGGER.info("Creating verification...");
        String code = verification.getCode();
        UUID userId = verification.getUserId();
        UUID serverId = verification.getServerId();

        cancelExistingCodeVerification(code, userId, serverId);

        verification = verification.withCode(
                Verification.generateCode(verification.getType().equals(VerificationType.LINK) ?  32: 6,
                verification.getType().equals(VerificationType.LINK) ? CodeType.ALPHANUMERIC: CodeType.NUMERIC));

        verification = repository.save(verification);

        LOGGER.info("Verification created successfully with id: '" + verification.getId() + "'");
        return verification;
    }

    private void cancelExistingCodeVerification(String code, UUID userId, UUID serverId) {
        if(code != null) {
            Optional<Verification> optionalUserVerification = repository.findByCodeAndUserId(code, userId);
            Optional<Verification> optionalServerVerification = repository.findByCodeAndServerId(code, serverId);

            if(optionalUserVerification.isPresent()) {
                LOGGER.warning("User verification already exists with code: '" + code + "'");
                Verification userVerification = optionalUserVerification.get();
                userVerification.cancel();
                repository.save(userVerification);
                LOGGER.info("User verification cancelled successfully with code: '" + userVerification.getCode() + "'");
            }

            if(optionalServerVerification.isPresent()) {
                LOGGER.warning("Server verification already exists with code: '" + code + "'");
                Verification serverVerification = optionalServerVerification.get();
                serverVerification.cancel();
                repository.save(serverVerification);
                LOGGER.info("Server verification cancelled successfully with code: '" + serverVerification.getCode() + "'");
            }

        }
    }
}
