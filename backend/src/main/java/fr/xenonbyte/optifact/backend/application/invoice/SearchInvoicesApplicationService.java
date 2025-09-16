package fr.xenonbyte.optifact.backend.application.invoice;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.SearchInvoicesUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceState;

import java.util.UUID;
import java.util.logging.Logger;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SearchInvoicesApplicationService implements SearchInvoicesUseCase {

    private static final Logger LOGGER = Logger.getLogger(SearchInvoicesApplicationService.class.getName());

    private final InvoiceRepository repository;

    public SearchInvoicesApplicationService(InvoiceRepository repository) {
        this.repository = repository;
    }

    @Override
    public Pagination<Invoice> searchInvoices(String referenceFilter, String actorName, String claimName, String stateFilter, CommonSearch search) {
        LOGGER.info("Searching invoices with referenceFilter: '" + referenceFilter + "', actorName: '" + actorName + "', claimName: '" + claimName + "', stateFilter: '" + stateFilter + "'" );
        Pagination<Invoice> page = repository.search(referenceFilter, actorName, claimName, stateFilter, search);
        LOGGER.info("Found " + page.elements().size() + " invoices (total: " + page.totalElements() + ")");
        return page;
    }
}
