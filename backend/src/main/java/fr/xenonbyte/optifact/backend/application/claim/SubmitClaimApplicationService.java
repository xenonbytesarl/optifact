package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.SubmitClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.time.ZonedDateTime;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SubmitClaimApplicationService implements SubmitClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(SubmitClaimApplicationService.class.getName());

    private final ClaimRepository repository;

    public SubmitClaimApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim submitClaim(UUID claimId) {
        LOGGER.info("Submitting claim with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        claim = claim.withSubmit(ZonedDateTime.now());

        claim = repository.save(claim);

        LOGGER.info("Claim submitted successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
