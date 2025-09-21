package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimActorIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimProductIdNotChangeException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimProductIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.UpdateClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.out.AttachmentRepository;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLine;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;

import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class UpdateClaimApplicationService implements UpdateClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(UpdateClaimApplicationService.class.getName());

    private final ClaimRepository repository;
    private final ProductRepository productRepository;
    private final ActorRepository actorRepository;
    private final AttachmentRepository attachmentRepository;


    public UpdateClaimApplicationService(
            ClaimRepository repository,
            ProductRepository productRepository,
            ActorRepository actorRepository,
            AttachmentRepository attachmentRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.actorRepository = actorRepository;
        this.attachmentRepository = attachmentRepository;
    }

    @Override
    public Claim updateClaim(UUID claimId, Claim claim) {
        LOGGER.info("Updating claim with id: '" + claimId + "'");
        Claim existing = repository.findById(claimId)
                .orElseThrow(() -> new ClaimIdNotFoundException(claimId));

        final UUID actorId = claim.getActorId();
        if(!actorRepository.existsById(actorId)) {
            throw new ClaimActorIdNotFoundException(actorId);
        }

        final UUID productId = claim.getProductId();
        Product product = productRepository.findById(productId).orElseThrow(() -> new ClaimProductIdNotFoundException(productId));

        if(!existing.getProductId().equals(productId)) {
            List<UUID> attachmentsIds = claim.getLines().stream().map(ClaimLine::getAttachmentId).toList();
            if(!attachmentsIds.isEmpty() && attachmentRepository.existsByIdsAndFilenameNotNull(attachmentsIds)) {
                throw new ClaimProductIdNotChangeException(productId);
            }
            //3) Check if the product satisfies all preconditions (existing sequence and attachmentTypeIds is not empty)
            product.checkClaimPrecondition();

            //5) Generate the lines from attachmentTypeIds
            List<ClaimLine> claimLines = ClaimLine.create(product.getAttachementTypeIds(), existing.getId());
            claim = claim.withLines(claimLines);
        }

        Claim updated = existing.update(
                claim.getActorId(),
                claim.getProductId(),
                claim.getSubmitAt(),
                claim.getManagerQuoteId(),
                claim.getManagerCompliantId(),
                claim.getCompliantAt(),
                claim.getInInstructionAt(),
                claim.getInstructorId(),
                claim.getInstructionDoneAt(),
                claim.getInstructionRejectedAt(),
                claim.getAgreementById(),
                claim.getAgreementGrantedAt(),
                claim.getAgreementRefusedAt(),
                claim.getAgreementAdjournedAt(),
                claim.getCancelById(),
                claim.getCancelAt(),
                claim.getState(),
                claim.getReference(),
                claim.getGrantedAgreementAttachmentId(),
                claim.getRefusedAgreementAttachmentId(),
                claim.getLines()
        );

        updated = repository.save(updated);
        LOGGER.info("Claim updated successfully with id: '" + updated.getId() + "'");
        return updated;
    }
}
