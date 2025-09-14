package fr.xenonbyte.optifact.backend.application.claim.port.in;

import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface UploadClaimUseCase {
    Claim uploadClaim(UUID claimId, UUID claimLineId);
}
