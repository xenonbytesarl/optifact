package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimHasNonInstructedBadException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.TerminateInstructionClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLine;
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
public final class TerminateInstructClaimApplicationService implements TerminateInstructionClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(TerminateInstructClaimApplicationService.class.getName());

    private final ClaimRepository repository;

    public TerminateInstructClaimApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim terminateInstructClaim(UUID claimId) {
        LOGGER.info("Claim terminate instructing claim with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        boolean hasNonInstructed = claim.getLines().stream().anyMatch(ClaimLine::notInstructed);

        if(hasNonInstructed) {
            throw new ClaimHasNonInstructedBadException(claimId);
        }

        boolean hasRejectedLines = claim.getLines().stream().anyMatch(ClaimLine::isRejected);

        if(hasRejectedLines) {
            //TODO managerId will set while user management implementation will be completed
            claim = claim.withInstructionRejected(null, ZonedDateTime.now());
        } else {
            //TODO managerId will set while user management implementation will be completed
            claim = claim.withInstructionDone(null, ZonedDateTime.now());
        }

        claim = repository.save(claim);

        LOGGER.info("Claim terminate instruction successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
