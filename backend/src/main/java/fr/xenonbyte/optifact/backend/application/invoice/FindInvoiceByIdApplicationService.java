package fr.xenonbyte.optifact.backend.application.invoice;

import fr.xenonbyte.optifact.backend.application.invoice.exception.InvoiceIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.FindInvoiceByIdUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import fr.xenonbyte.optifact.backend.domain.invoice.message.InvoiceMessage;

import java.util.UUID;
import java.util.logging.Logger;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindInvoiceByIdApplicationService implements FindInvoiceByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindInvoiceByIdApplicationService.class.getName());

    private final InvoiceRepository repository;

    public FindInvoiceByIdApplicationService(InvoiceRepository repository) {
        this.repository = repository;
    }

    @Override
    public Invoice findInvoiceById(UUID invoiceId) {
        LOGGER.info("Finding invoice by id: '" + invoiceId + "'");
        return repository.findById(invoiceId)
                .orElseThrow(() -> new InvoiceIdNotFoundException(invoiceId));
    }
}
