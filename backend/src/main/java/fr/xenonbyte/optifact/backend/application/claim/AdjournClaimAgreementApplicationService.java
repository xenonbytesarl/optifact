package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimStateNotCompleteCompliantBadException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.AdjournClaimAgreementClaimUseCase;
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
public final class AdjournClaimAgreementApplicationService implements AdjournClaimAgreementClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(AdjournClaimAgreementApplicationService.class.getName());

    private final ClaimRepository repository;

    public AdjournClaimAgreementApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim adjournClaimAgreement(UUID claimId) {
        LOGGER.info("Adjourn claim agreement with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        if(!claim.isCompleteCompliant()) {
            throw new ClaimStateNotCompleteCompliantBadException();
        }

        //TODO the agreementById will be set when user management will be completed
        claim = claim.withAgreementAdjourn(ZonedDateTime.now(), null);

        claim = repository.save(claim);

        LOGGER.info("Adjourn claim agreement successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
