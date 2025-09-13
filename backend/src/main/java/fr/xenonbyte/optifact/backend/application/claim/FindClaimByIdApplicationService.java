package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.FindClaimByIdUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindClaimByIdApplicationService implements FindClaimByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindClaimByIdApplicationService.class.getName());

    private final ClaimRepository repository;

    public FindClaimByIdApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim findClaimById(UUID claimId) {
        LOGGER.info("Find claim with id: '" + claimId + "'");
        Claim claim = repository.findById(claimId)
                .orElseThrow(() -> new ClaimIdNotFoundException(claimId));
        LOGGER.info("Claim found successfully with id: '" + claimId + "'");
        return claim;
    }
}
