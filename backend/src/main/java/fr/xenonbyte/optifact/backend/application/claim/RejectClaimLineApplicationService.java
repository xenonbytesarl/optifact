package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimLineIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.RejectClaimLineUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.ValidateClaimLineUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLine;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class RejectClaimLineApplicationService implements RejectClaimLineUseCase {

    private static final Logger LOGGER = Logger.getLogger(RejectClaimLineApplicationService.class.getName());

    private final ClaimRepository repository;

    public RejectClaimLineApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim rejectClaimLine(UUID claimId, UUID claimLineId, String reason) {
        LOGGER.info("Reject claim line with id: '" + claimLineId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        Optional<ClaimLine> optionalClaimLine = claim.getLines().stream()
                .filter(line -> line.getId().equals(claimLineId))
                .findFirst();

        if (optionalClaimLine.isEmpty()) {
            throw new ClaimLineIdNotFoundException(claimLineId);
        }
        //TODO the RejectById will be set when user management will be completed
        ClaimLine rejectedClaimLine = optionalClaimLine.get().withRejected(null, ZonedDateTime.now(), reason);

        List<ClaimLine> claimLines = ClaimLine.replace(claim.getLines(), rejectedClaimLine);

        claim = claim.withLines(claimLines);

        claim = repository.save(claim);

        LOGGER.info("Claim line rejected successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
