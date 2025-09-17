package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimStateNotCompleteCompliantBadException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.GrantClaimAgreementClaimUseCase;
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
public final class GrantClaimAgreementApplicationService implements GrantClaimAgreementClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(GrantClaimAgreementApplicationService.class.getName());

    private final ClaimRepository repository;

    public GrantClaimAgreementApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim grantClaimAgreement(UUID claimId) {
        LOGGER.info("Grant claim agreement with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        if(!claim.isCompleteCompliant()) {
            throw new ClaimStateNotCompleteCompliantBadException();
        }

        //TODO the agreementById will be set when user management will be completed
        claim = claim.withAgreementGranted(ZonedDateTime.now(), null);

        claim = repository.save(claim);

        LOGGER.info("Grant claim agreement successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
