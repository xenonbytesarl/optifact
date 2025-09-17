package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.CompleteCompliantClaimUseCase;
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
public final class CompleteComplianceClaimApplicationService implements CompleteCompliantClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(CompleteComplianceClaimApplicationService.class.getName());

    private final ClaimRepository repository;

    public CompleteComplianceClaimApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim completeCompliantClaim(UUID claimId) {
        LOGGER.info("Complete and compliance claim with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        if(!claim.isInstructionDone()) {
            throw new ClaimStateNotInstructionDoneBadException();
        }

        //TODO the completeById will be set when user management will be completed
        claim = claim.withCompleteCompliance(ZonedDateTime.now(), null);

        claim = repository.save(claim);

        LOGGER.info("Complete compliance claim successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
