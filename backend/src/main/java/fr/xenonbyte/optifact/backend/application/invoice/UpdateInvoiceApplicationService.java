package fr.xenonbyte.optifact.backend.application.invoice;

import fr.xenonbyte.optifact.backend.application.actor.exception.ActorIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.invoice.exception.InvoiceIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.UpdateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.util.UUID;
import java.util.logging.Logger;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class UpdateInvoiceApplicationService implements UpdateInvoiceUseCase {

    private static final Logger LOGGER = Logger.getLogger(UpdateInvoiceApplicationService.class.getName());

    private final InvoiceRepository repository;
    private final ActorRepository actorRepository;
    private final ClaimRepository claimRepository;

    public UpdateInvoiceApplicationService(InvoiceRepository repository, ActorRepository actorRepository, ClaimRepository claimRepository) {
        this.repository = repository;
        this.actorRepository = actorRepository;
        this.claimRepository = claimRepository;
    }

    @Override
    public Invoice updateInvoice(UUID invoiceId, Invoice invoice) {
        LOGGER.info("Updating invoice with id: '" + invoiceId + "'");
        // Ensure we update the right entity by overwriting id if needed
        // Fetch existing to ensure it exists
        Invoice existing = repository.findById(invoiceId)
                .orElseThrow(() -> new InvoiceIdNotFoundException(invoiceId));

        if(!actorRepository.existsById(invoice.getActorId())) {
            throw new ActorIdNotFoundException(invoice.getActorId());
        }

        UUID claimId = invoice.getClaimId();
        if(claimId != null && !claimRepository.existsById(claimId)) {
            throw new ClaimIdNotFoundException(claimId);
        }

        // For now, just persist the provided invoice. In a richer model, we'd merge fields on 'existing'.
        // Keep the identifier from the path parameter
        existing = existing.update(
                invoice.getReference(),
                invoice.getSendAt(),
                invoice.getActorId(),
                invoice.getDueAt(),
                invoice.getAmountCurrency(),
                invoice.getClaimId(),
                invoice.getBankAccount(),
                invoice.getState(),
                invoice.getLines()
        );

        existing = existing.computeAmount();

        Invoice saved = repository.save(existing);
        LOGGER.info("Invoice updated successfully with id: '" + saved.getId() + "'");
        return saved;
    }
}
