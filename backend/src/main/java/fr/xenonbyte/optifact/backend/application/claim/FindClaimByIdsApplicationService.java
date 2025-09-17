package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.port.in.FindClaimByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindClaimByIdsApplicationService implements FindClaimByIdsUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindClaimByIdsApplicationService.class.getName());

    private final ClaimRepository repository;

    public FindClaimByIdsApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Claim> findClaimByIds(Set<UUID> claimIds) {
        LOGGER.info("Find claim with ids: '" + claimIds + "'");
        List<Claim> claims = repository.findByIds(claimIds);
        LOGGER.info("Claim found successfully with ids: '" + claimIds + "'");
        return claims;
    }
}
