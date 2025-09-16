package fr.xenonbyte.optifact.backend.infrastructure.claim;

import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLine;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLineStatus;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimState;
import fr.xenonbyte.optifact.backend.infrastructure.common.attachment.AttachmentJpa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import java.util.ArrayList;
import java.util.List;

@Mapper
public interface ClaimMapperJpa {

    @Mapping(target = "actor", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.actor.ActorJpa.builder().id(claim.getActorId()).build())")
    @Mapping(target = "product", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.product.ProductJpa.builder().id(claim.getProductId()).build())")
    @Mapping(target = "state", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.claim.ClaimStateJpa.valueOf(claim.getState().name()))")
    @Mapping(target = "lines", expression = "java(toJpaLines(claim.getLines()))")
    ClaimJpa toJpa(Claim claim);

    @Mapping(target = "lines", ignore = true)
    Claim toDomain(ClaimJpa jpa);

    default List<ClaimLineJpa> toJpaLines(List<ClaimLine> lines) {
        if (lines == null) return java.util.Collections.emptyList();
        List<ClaimLineJpa> list = new ArrayList<>();
        for (ClaimLine l : lines) {
            ClaimLineJpa j = ClaimLineJpa.builder()
                    .id(l.getId())
                    .createdAt(l.getCreatedAt())
                    .uploadedAt(l.getUploadedAt())
                    .attachment(l.getAttachmentId() == null ? null : AttachmentJpa.builder().id(l.getAttachmentId()).build())
                    .updatedAt(l.getUpdatedAt())
                    .validateAt(l.getValidateAt())
                    .validateById(l.getValidateById())
                    .rejectedAt(l.getRejectedAt())
                    .rejectedById(l.getRejectedById())
                    .cancelledAt(l.getCancelledAt())
                    .cancelledById(l.getCancelledById())
                    .status(ClaimLineStatusJpa.valueOf(l.getStatus().name()))
                    .reason(l.getReason())
                    .claim(ClaimJpa.builder().id(l.getClaimId()).build())
                    .build();
            list.add(j);
        }
        return list;
    }

    @ObjectFactory
    default Claim createClaim(ClaimJpa jpa) {
        List<ClaimLine> lines = new ArrayList<>();
        if (jpa.getLines() != null) {
            for (ClaimLineJpa l : jpa.getLines()) {
                ClaimLine dl = ClaimLine.create(
                        l.getId(),
                        l.getAttachment() != null ? l.getAttachment().getId() : null,
                        l.getCreatedAt(),
                        l.getUploadedAt(),
                        l.getValidateAt(),
                        l.getValidateById(),
                        l.getRejectedAt(),
                        l.getRejectedById(),
                        l.getCancelledAt(),
                        l.getCancelledById(),
                        ClaimLineStatus.valueOf(l.getStatus().name()),
                        l.getReason(),
                        jpa.getId()
                );
                lines.add(dl);
            }
        }
        return Claim.create(
                jpa.getId(),
                jpa.getActor().getId(),
                jpa.getProduct().getId(),
                jpa.getSubmitAt(),
                jpa.getManagerQuoteId(),
                jpa.getManagerCompliantById(),
                jpa.getCompliantAt(),
                jpa.getInInstructionAt(),
                jpa.getInstructorId(),
                jpa.getInstructionDoneAt(),
                jpa.getInstructionRejectedAt(),
                jpa.getAgreementById(),
                jpa.getAgreementGrantedAt(),
                jpa.getAgreementRefusedAt(),
                jpa.getAgreementAdjournedAt(),
                jpa.getCancelById(),
                jpa.getCancelAt(),
                ClaimState.valueOf(jpa.getState().name()),
                jpa.getReference(),
                lines
        );
    }
}
