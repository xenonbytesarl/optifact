package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimStateNotInstructionRejectedBadException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.BackClaimToDraftUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLine;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class BackToDraftClaimApplicationService implements BackClaimToDraftUseCase {

    private static final Logger LOGGER = Logger.getLogger(BackToDraftClaimApplicationService.class.getName());

    private final ClaimRepository repository;

    public BackToDraftClaimApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim backClaimToDraft(UUID claimId) {
        LOGGER.info("Backing claim to draft with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        if(!claim.isInstructionRejected()) {
            throw new ClaimStateNotInstructionRejectedBadException();
        }

        claim = claim.withDraft();

        claim = repository.save(claim);

        LOGGER.info("Back claim to draft successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
