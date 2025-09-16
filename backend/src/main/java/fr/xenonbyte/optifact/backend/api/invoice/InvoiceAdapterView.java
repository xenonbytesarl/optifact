package fr.xenonbyte.optifact.backend.api.invoice;

import fr.xenonbyte.optifact.backend.api.invoice.generated.view.*;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.CreateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.DeleteInvoiceByIdUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.FindInvoiceByIdUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.SearchInvoicesUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.UpdateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import static org.springframework.http.HttpStatus.OK;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public class InvoiceAdapterView {

    private final CreateInvoiceUseCase createUseCase;
    private final UpdateInvoiceUseCase updateUseCase;
    private final FindInvoiceByIdUseCase findByIdUseCase;
    private final DeleteInvoiceByIdUseCase deleteByIdUseCase;
    private final SearchInvoicesUseCase searchUseCase;
    private final InvoiceMapperView mapperView;

    public InvoiceAdapterView(CreateInvoiceUseCase createUseCase,
                              UpdateInvoiceUseCase updateUseCase,
                              FindInvoiceByIdUseCase findByIdUseCase,
                              DeleteInvoiceByIdUseCase deleteByIdUseCase,
                              SearchInvoicesUseCase searchUseCase,
                              InvoiceMapperView mapperView) {
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.findByIdUseCase = findByIdUseCase;
        this.deleteByIdUseCase = deleteByIdUseCase;
        this.searchUseCase = searchUseCase;
        this.mapperView = mapperView;
    }

    public InvoiceResponseView createInvoice(@Valid InvoiceApiRequestView view) {
        Invoice created = createUseCase.createInvoice(mapperView.createInvoice(view));
        return mapperView.toResponseView(created);
    }

    public InvoiceResponseView updateInvoice(UUID id, @Valid UpdateInvoiceApiRequestView view) {
        Invoice updated = updateUseCase.updateInvoice(id, mapperView.createInvoice(view));
        return mapperView.toResponseView(updated);
    }

    public void deleteInvoiceById(UUID id) {
        deleteByIdUseCase.deleteInvoiceById(id);
    }

    public InvoiceResponseView findInvoiceById(UUID id) {
        return mapperView.toResponseView(findByIdUseCase.findInvoiceById(id));
    }

    public InvoicePageResponseView searchInvoices(String referenceFilter,
                                                              Integer page,
                                                              Integer size,
                                                              String sortField,
                                                              String sortDirection,
                                                              String actorName,
                                                              String claimName,
                                                              InvoiceStateView stateFilter) {
        long safePage = page == null ? 0L : page.longValue();
        long safeSize = size == null ? 20L : size.longValue();
        String safeSort = (sortField == null || sortField.isBlank()) ? "createdAt" : sortField;
        Direction safeDirection;
        if (sortDirection == null) {
            safeDirection = Direction.ASC;
        } else {
            try { safeDirection = Direction.valueOf(sortDirection.trim().toUpperCase()); }
            catch (IllegalArgumentException ex) { safeDirection = Direction.ASC; }
        }
        String state = stateFilter == null ? null : stateFilter.name();
        Pagination<Invoice> pageResult = searchUseCase.searchInvoices(
                referenceFilter,
                actorName,
                claimName,
                state,
                new CommonSearch(safePage, safeSize, safeSort, safeDirection)
        );
        return mapperView.toResponsePageView(pageResult);
    }
}
