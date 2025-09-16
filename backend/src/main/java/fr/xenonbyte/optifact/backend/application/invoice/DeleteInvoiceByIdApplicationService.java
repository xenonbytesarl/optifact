package fr.xenonbyte.optifact.backend.application.invoice;

import fr.xenonbyte.optifact.backend.application.invoice.port.in.DeleteInvoiceByIdUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.util.UUID;
import java.util.logging.Logger;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class DeleteInvoiceByIdApplicationService implements DeleteInvoiceByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(DeleteInvoiceByIdApplicationService.class.getName());

    private final InvoiceRepository repository;

    public DeleteInvoiceByIdApplicationService(InvoiceRepository repository) {
        this.repository = repository;
    }

    @Override
    public void deleteInvoiceById(UUID invoiceId) {
        LOGGER.info("Deleting invoice with id: '" + invoiceId + "'" );
        Invoice invoice = repository.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found with id: " + invoiceId));

        invoice.checkDeletable();

        repository.delete(invoice);
        LOGGER.info("Invoice with id: '" + invoiceId + "' deleted successfully");
    }
}
