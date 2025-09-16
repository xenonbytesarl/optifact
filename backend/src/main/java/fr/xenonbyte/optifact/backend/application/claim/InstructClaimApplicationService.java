package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.InstructClaimUseCase;
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
public final class InstructClaimApplicationService implements InstructClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(InstructClaimApplicationService.class.getName());

    private final ClaimRepository repository;

    public InstructClaimApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim instructClaim(UUID claimId) {
        LOGGER.info("Instructing claim with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        //TODO managerId will set while user management implementation will be completed
        claim = claim.withInInstruction(null, ZonedDateTime.now());

        claim = repository.save(claim);

        LOGGER.info("Claim put instruction successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
