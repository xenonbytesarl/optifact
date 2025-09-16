package fr.xenonbyte.optifact.backend.application.invoice;

import fr.xenonbyte.optifact.backend.application.actor.exception.ActorIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.CreateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.util.UUID;
import java.util.logging.Logger;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateInvoiceApplicationService implements CreateInvoiceUseCase {

    private static final Logger LOGGER = Logger.getLogger(CreateInvoiceApplicationService.class.getName());

    private final InvoiceRepository repository;
    private final ActorRepository actorRepository;
    private final ClaimRepository claimRepository;

    public CreateInvoiceApplicationService(InvoiceRepository repository, ActorRepository actorRepository, ClaimRepository claimRepository) {
        this.repository = repository;
        this.actorRepository = actorRepository;
        this.claimRepository = claimRepository;
    }

    @Override
    public Invoice createInvoice(Invoice invoice) {
        LOGGER.info("Creating invoice...");

        if(!actorRepository.existsById(invoice.getActorId())) {
            throw new ActorIdNotFoundException(invoice.getActorId());
        }

        UUID claimId = invoice.getClaimId();
        if(claimId != null && claimRepository.existsById(claimId)) {
            throw new ClaimIdNotFoundException(claimId);
        }

        invoice = invoice.computeAmount();

        invoice = repository.save(invoice);
        LOGGER.info("Invoice created successfully with id: '" + invoice.getId() + "'");
        return invoice;
    }
}
