package fr.xenonbyte.optifact.backend.application.verification.port.out;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationStatus;

import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 23/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.Repository
@Hexagonal.SecondaryPort
public interface VerificationRepository {
    Optional<Verification> findByUserIdAndState(UUID userId, VerificationStatus status);

    Optional<Verification> findByServerIdState(UUID serverId, VerificationStatus status);

    Verification save(Verification verification);

    Optional<Verification> findByCodeAndUserIdAndState(String code, UUID userId, VerificationStatus status);

    Optional<Verification> findByCodeAndUserId(String code, UUID userId);
}
