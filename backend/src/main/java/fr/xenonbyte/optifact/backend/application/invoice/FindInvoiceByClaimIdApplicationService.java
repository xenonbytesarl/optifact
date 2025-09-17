package fr.xenonbyte.optifact.backend.application.invoice;

import fr.xenonbyte.optifact.backend.application.invoice.port.in.FindInvoiceByClaimIdUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindInvoiceByClaimIdApplicationService implements FindInvoiceByClaimIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindInvoiceByClaimIdApplicationService.class.getName());

    private final InvoiceRepository repository;

    public FindInvoiceByClaimIdApplicationService(InvoiceRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Invoice> findInvoiceByClaimId(UUID claimId) {
        LOGGER.info("Find invoice by claim id: '" + claimId + "'");
        List<Invoice> invoices = repository.findByClaimId(claimId);
        LOGGER.info(invoices.isEmpty() ? "No invoice found for claim id: " + claimId: "Invoice found successfully by claim id: '" + claimId + "'");
        return invoices;
    }
}
