package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.DeleteClaimByIdUseCase;
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
public final class DeleteClaimByIdApplicationService implements DeleteClaimByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(DeleteClaimByIdApplicationService.class.getName());

    private final ClaimRepository repository;

    public DeleteClaimByIdApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public void deleteClaimById(UUID claimId) {
        LOGGER.info("Deleting claim with id: '" + claimId + "'");
        Claim existing = repository.findById(claimId)
                .orElseThrow(() -> new ClaimIdNotFoundException(claimId));
        repository.delete(existing);
        LOGGER.info("Claim deleted successfully with id: '" + claimId + "'");
    }
}
