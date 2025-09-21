package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimStateNotCompleteCompliantBadException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.RefuseClaimAgreementClaimUseCase;
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
public final class RefuseClaimAgreementApplicationService implements RefuseClaimAgreementClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(RefuseClaimAgreementApplicationService.class.getName());

    private final ClaimRepository repository;

    public RefuseClaimAgreementApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Claim refuseClaimAgreement(UUID claimId, UUID refuseAttachmentDecisionId) {
        LOGGER.info("Refuse claim agreement with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        if(!claim.isCompleteCompliant()) {
            throw new ClaimStateNotCompleteCompliantBadException();
        }

        //TODO the agreementById will be set when user management will be completed
        claim = claim.withAgreementRefused(ZonedDateTime.now(), null, refuseAttachmentDecisionId);

        claim = repository.save(claim);

        LOGGER.info("Refuse claim agreement successfully with id: '" + claim.getId() + "'");
        return claim;
    }
}
