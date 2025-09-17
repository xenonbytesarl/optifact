package fr.xenonbyte.optifact.backend.api.invoice;

import fr.xenonbyte.optifact.backend.api.invoice.generated.view.*;
import fr.xenonbyte.optifact.backend.application.actor.port.in.FindActorByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.FindClaimByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.CreateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.DeleteInvoiceByIdUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.FindInvoiceByIdUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.SearchInvoicesUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.UpdateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

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
    private final FindActorByIdsUseCase findActorByIdsUseCase;
    private final FindClaimByIdsUseCase findClaimByIdsUseCase;

    public InvoiceAdapterView(CreateInvoiceUseCase createUseCase,
                              UpdateInvoiceUseCase updateUseCase,
                              FindInvoiceByIdUseCase findByIdUseCase,
                              DeleteInvoiceByIdUseCase deleteByIdUseCase,
                              SearchInvoicesUseCase searchUseCase,
                              InvoiceMapperView mapperView,
                              FindActorByIdsUseCase findActorByIdsUseCase,
                              FindClaimByIdsUseCase findClaimByIdsUseCase) {
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.findByIdUseCase = findByIdUseCase;
        this.deleteByIdUseCase = deleteByIdUseCase;
        this.searchUseCase = searchUseCase;
        this.mapperView = mapperView;
        this.findActorByIdsUseCase = findActorByIdsUseCase;
        this.findClaimByIdsUseCase = findClaimByIdsUseCase;
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
        Set<UUID> actorsIds = pageResult.elements().stream()
                .map(Invoice::getActorId).
                collect(Collectors.toSet());
        Map<UUID, String> actorNameMap = findActorByIdsUseCase.findActorByIds(actorsIds).stream()
                .collect(Collectors.toMap(BaseEntity::getId, Actor::getName));
        Set<UUID> claimIds = pageResult.elements().stream().map(Invoice::getClaimId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
        Map<UUID, String> claimReferenceMap = findClaimByIdsUseCase.findClaimByIds(claimIds).stream()
                .collect(Collectors.toMap(Claim::getId, Claim::getReference));

        InvoicePageResponseView responsePageView = mapperView.toResponsePageView(pageResult);

        if(!actorNameMap.isEmpty() && !claimReferenceMap.isEmpty()) {
            List<InvoiceResponseView> invoiceResponseViews = responsePageView.getElements().stream()
                    .map(element -> richElement(element, actorNameMap, claimReferenceMap))
                    .toList();
            responsePageView.setElements(invoiceResponseViews);
        }
        return responsePageView;
    }

    private InvoiceResponseView richElement(@Valid InvoiceResponseView element, Map<UUID, String> actorNameMap, Map<UUID, String> claimReferenceMap) {
        UUID actorId = element.getActorId();
        UUID claimId = element.getClaimId();
        String actorName = null;
        String claimReference = null;
        if(!actorNameMap.isEmpty()) {
            actorName = actorNameMap.getOrDefault(actorId, null);
        }
        if(!claimReferenceMap.isEmpty() && claimId != null) {
            claimReference = claimReferenceMap.getOrDefault(element.getClaimId(), null);
        }
        element.setActorName(actorName);
        element.setClaimReference(claimReference);
        return element;
    }
}
