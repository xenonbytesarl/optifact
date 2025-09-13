package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimActorIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimProductIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.CreateClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.out.AttachmentRepository;
import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepository;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLine;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;
import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;
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
public final class CreateClaimApplicationService implements CreateClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(CreateClaimApplicationService.class.getName());

    private final ClaimRepository repository;
    private final ProductRepository productRepository;
    private final ActorRepository actorRepository;
    private final SequenceRepository sequenceRepository;
    private final AttachmentRepository attachmentRepository;

    public CreateClaimApplicationService(
            ClaimRepository repository,
            ProductRepository productRepository,
            ActorRepository actorRepository,
            SequenceRepository sequenceRepository,
            AttachmentRepository attachmentRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.actorRepository = actorRepository;
        this.sequenceRepository = sequenceRepository;
        this.attachmentRepository = attachmentRepository;
    }

    @Override
    public Claim createClaim(Claim claim) {
        LOGGER.info("Creating claim...");

        //1) Check if actorId exists
        final UUID actorId = claim.getActorId();
        if(!actorRepository.existsById(actorId)) {
            throw new ClaimActorIdNotFoundException(actorId);
        }

        //2) Check if productId exists
        final UUID productId = claim.getProductId();
        Product product = productRepository.findById(productId).orElseThrow(() -> new ClaimProductIdNotFoundException(productId));

        //3) Check if the product satisfies all preconditions (existing sequence and attachmentTypeIds is not empty)
        product.checkClaimPrecondition();

        //4) Generate a new one to populate reference
        final UUID sequenceId = product.getSequenceId();
        Sequence sequence = sequenceRepository.findById(sequenceId).orElseThrow(() -> new SequenceIdNotFoundException(sequenceId));
        String nextNumber = sequence.nextNumber();
        claim = claim.withReference(nextNumber);

        //5) Generate and save attachments
        List<Attachment> attachments = Attachment.create(product.getAttachementTypeIds(), claim.getId());
        attachments = attachmentRepository.saveAll(attachments);

        //6) Generate and claim line from attachment
        List<ClaimLine> claimLines = ClaimLine.create(attachments.stream().map(Attachment::getId).toList(), claim.getId());
        claim = claim.withLines(claimLines);

        //6) Save the claim and the sequence
        claim = repository.save(claim);
        LOGGER.info("Claim created successfully with id: '" + claim.getId() + "'");

        sequence = sequence.incrementNext();
        sequenceRepository.save(sequence);
        LOGGER.info("Sequence updated successfully with id: '" + sequence.getId() + "'");

        return claim;
    }
}
