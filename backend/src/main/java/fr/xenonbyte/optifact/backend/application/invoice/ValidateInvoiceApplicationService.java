package fr.xenonbyte.optifact.backend.application.invoice;

import fr.xenonbyte.optifact.backend.application.invoice.exception.InvoiceIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.invoice.exception.InvoiceStateNotDraftBadException;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.ValidateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class ValidateInvoiceApplicationService implements ValidateInvoiceUseCase {

    private static final Logger LOGGER = Logger.getLogger(ValidateInvoiceApplicationService.class.getName());

    private final InvoiceRepository repository;

    public ValidateInvoiceApplicationService(InvoiceRepository repository) {
        this.repository = repository;
    }

    @Override
    public Invoice validateInvoice(UUID invoiceId) {
        LOGGER.info("Validating invoice with id: '" + invoiceId + "'" );

        Invoice invoice = repository.findById(invoiceId).orElseThrow(() -> new InvoiceIdNotFoundException(invoiceId));

        if (!invoice.isDraft()) {
            throw new InvoiceStateNotDraftBadException();
        }

        invoice  = invoice.withValidate(ZonedDateTime.now());

        repository.save(invoice);
        LOGGER.info("Invoice validated successfully with id: '" + invoice.getId() + "'");
        return invoice;
    }
}
