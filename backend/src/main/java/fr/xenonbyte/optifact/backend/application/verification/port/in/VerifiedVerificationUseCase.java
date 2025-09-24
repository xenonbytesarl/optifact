package fr.xenonbyte.optifact.backend.application.verification.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

/**
 * Primary port to mark a Verification as verified.
 *
 * @author bamk
 * @version 1.0
 * @since 23/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface VerifiedVerificationUseCase {
    void verifyUserCode(UUID userId, String code);

    void verifyServerCode(UUID settingId, String code);
}
