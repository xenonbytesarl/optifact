package fr.xenonbyte.optifact.backend.application.invoice;

import fr.xenonbyte.optifact.backend.application.actor.exception.ActorIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceCodeNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepository;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.CreateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.util.UUID;
import java.util.logging.Logger;

import static fr.xenonbyte.optifact.backend.domain.invoice.Invoice.DEFAULT_INVOICE_CODE;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateInvoiceApplicationService implements CreateInvoiceUseCase {

    private static final Logger LOGGER = Logger.getLogger(CreateInvoiceApplicationService.class.getName());

    private final InvoiceRepository repository;
    private final ActorRepository actorRepository;
    private final ClaimRepository claimRepository;
    private final SequenceRepository sequenceRepository;

    public CreateInvoiceApplicationService(
            InvoiceRepository repository,
            ActorRepository actorRepository,
            ClaimRepository claimRepository,
            SequenceRepository sequenceRepository) {
        this.repository = repository;
        this.actorRepository = actorRepository;
        this.claimRepository = claimRepository;
        this.sequenceRepository = sequenceRepository;
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        LOGGER.info("Creating invoice...");

        if(!actorRepository.existsById(invoice.getActorId())) {
            throw new ActorIdNotFoundException(invoice.getActorId());
        }

        UUID claimId = invoice.getClaimId();
        if(claimId != null && !claimRepository.existsById(claimId)) {
            throw new ClaimIdNotFoundException(claimId);
        }

        Sequence sequence = sequenceRepository.findByCode(DEFAULT_INVOICE_CODE)
                .orElseThrow(() -> new SequenceCodeNotFoundException(DEFAULT_INVOICE_CODE));
        String nextNumber = sequence.nextNumber();

        invoice = invoice.computeAmount()
                .withReference(nextNumber);

        invoice = repository.save(invoice);
        LOGGER.info("Invoice created successfully with id: '" + invoice.getId() + "'");

        sequence = sequence.incrementNext();
        sequenceRepository.save(sequence);
        LOGGER.info("Sequence updated successfully with id: '" + sequence.getId() + "'");
        return invoice;
    }
}
