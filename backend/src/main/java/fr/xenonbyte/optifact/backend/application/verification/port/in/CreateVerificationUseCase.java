package fr.xenonbyte.optifact.backend.application.verification.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;

import java.time.ZonedDateTime;
import java.util.UUID;

/**
 *
 * @author bamk
 * @version 1.0
 * @since 23/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface CreateVerificationUseCase {

    Verification create(Verification verification);
}
