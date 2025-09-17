package fr.xenonbyte.optifact.backend.application.claim.port.in;

import fr.xenonbyte.optifact.backend.domain.claim.Claim;

import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
public interface FindClaimByIdsUseCase {
    List<Claim> findClaimByIds(Set<UUID> claimIds);
}
