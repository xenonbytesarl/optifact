package fr.xenonbyte.optifact.backend.api.claim;

import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimApiRequestView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimLineStatusView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimPageResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimStateView;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLineStatus;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimState;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

import java.util.Collections;

@Mapper
public interface ClaimMapperView { 

    default ClaimStateView mapState(ClaimState state) {
        if (state == null) return null;
        return switch (state) {
            case DRAFT -> ClaimStateView.DRAFT;
            case SUBMITTED -> ClaimStateView.SUBMITTED;
            case REJECTED -> ClaimStateView.REJECTED;
            case IN_INSTRUCTION -> ClaimStateView.IN_INSTRUCTION;
            case VALIDATED -> ClaimStateView.VALIDATED;
            case DONE -> ClaimStateView.DONE;
            case CANCELLED -> ClaimStateView.CANCELLED;
        };
    }

    default ClaimLineStatusView mapLineStatus(ClaimLineStatus status) {
        if (status == null) return null;
        return switch (status) {
            case DRAFT -> ClaimLineStatusView.DRAFT;
            case UPLOADED -> ClaimLineStatusView.UPLOADED;
            case VALIDATED -> ClaimLineStatusView.VALIDATED;
            case REJECTED -> ClaimLineStatusView.REJECTED;
            case CANCELLED -> ClaimLineStatusView.CANCELLED;
        };
    }

    Claim toDomain(ClaimApiRequestView requestView);

    ClaimResponseView toResponseView(Claim domain);

    ClaimPageResponseView toResponsePageView(Pagination<Claim> page);

    @ObjectFactory
    default Claim createClaim(ClaimApiRequestView view) {
        return Claim.create(
                view.getActorId(),
                view.getProductId(),
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                ClaimState.DRAFT,
                view.getReference(),
                Collections.emptyList()
        );
    }
}
