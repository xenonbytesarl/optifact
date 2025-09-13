package fr.xenonbyte.optifact.backend.api.claim;

import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimApiRequestView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimPageResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimResponseView;
import fr.xenonbyte.optifact.backend.application.claim.port.in.CreateClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.DeleteClaimByIdUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.FindClaimByIdUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.SearchClaimsUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.UpdateClaimUseCase;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public class ClaimAdapterView {

    private final CreateClaimUseCase createUseCase;
    private final UpdateClaimUseCase updateUseCase;
    private final FindClaimByIdUseCase findByIdUseCase;
    private final DeleteClaimByIdUseCase deleteByIdUseCase;
    private final SearchClaimsUseCase searchUseCase;
    private final ClaimMapperView mapperView;

    public ClaimAdapterView(CreateClaimUseCase createUseCase,
                            UpdateClaimUseCase updateUseCase,
                            FindClaimByIdUseCase findByIdUseCase,
                            DeleteClaimByIdUseCase deleteByIdUseCase,
                            SearchClaimsUseCase searchUseCase,
                            ClaimMapperView mapperView) {
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.findByIdUseCase = findByIdUseCase;
        this.deleteByIdUseCase = deleteByIdUseCase;
        this.searchUseCase = searchUseCase;
        this.mapperView = mapperView;
    }

    public ClaimResponseView createClaim(ClaimApiRequestView view) {
        return mapperView.toResponseView(createUseCase.createClaim(mapperView.toDomain(view)));
    }

    public ClaimResponseView updateClaim(UUID id, ClaimApiRequestView view) {
        return mapperView.toResponseView(updateUseCase.updateClaim(id, mapperView.toDomain(view)));
    }

    public void deleteClaimById(UUID id) {
        deleteByIdUseCase.deleteClaimById(id);
    }

    public ClaimResponseView findClaimById(UUID id) {
        return mapperView.toResponseView(findByIdUseCase.findClaimById(id));
    }

    public ClaimPageResponseView searchClaims(String referenceFilter,
                                              Integer page,
                                              Integer size,
                                              String sortField,
                                              String sortDirection,
                                              String actorName,
                                              String productName) {
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
        Pagination<Claim> pageResult = searchUseCase.searchClaims(
                referenceFilter,
                actorName,
                productName,
                new CommonSearch(safePage, safeSize, safeSort, safeDirection)
        );
        return mapperView.toResponsePageView(pageResult);
    }
}
