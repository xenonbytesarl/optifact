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
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import java.util.Collections;

@Mapper
public interface ClaimMapperView { 

    default ClaimStateView mapState(ClaimState state) {
        if (state == null) return null;
        return switch (state) {
            case DRAFT -> ClaimStateView.DRAFT;
            case SUBMITTED -> ClaimStateView.SUBMITTED;
            case IN_INSTRUCTION -> ClaimStateView.IN_INSTRUCTION;
            case INSTRUCTION_REJECTED -> ClaimStateView.INSTRUCTION_REJECTED;
            case INSTRUCTION_DONE -> ClaimStateView.INSTRUCTION_DONE;
            case COMPLETE_COMPLIANT -> ClaimStateView.COMPLETE_COMPLIANT;
            case AGREEMENT_REFUSED -> ClaimStateView.AGREEMENT_REFUSED;
            case AGREEMENT_GRANTED -> ClaimStateView.AGREEMENT_GRANTED;
            case AGREEMENT_ADJOURNED -> ClaimStateView.AGREEMENT_ADJOURNED;
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

    @Mapping(target = "uploadStarted", expression = "java(domain.isUploadStarted())")
    @Mapping(target = "uploadEnded", expression = "java(domain.isUploadEnded())")
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
