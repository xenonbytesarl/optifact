package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.UploadClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLine;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.time.ZonedDateTime;
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
public final class UploadClaimApplicationService implements UploadClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(UploadClaimApplicationService.class.getName());

    private final ClaimRepository repository;

    public UploadClaimApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim uploadClaim(UUID claimId, UUID claimLineId) {
        LOGGER.info("Uploading claim with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        List<ClaimLine> claimLines = claim.getLines().stream()
                .map(line -> {
                    if (line.getId().equals(claimLineId)) {
                        return line.withUploaded(ZonedDateTime.now());
                    }
                    return line;
                })
                .toList();
        claim = claim.withLines(claimLines);

        repository.save(claim);
        LOGGER.info("Claim uploaded successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
