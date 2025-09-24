package fr.xenonbyte.optifact.backend.domain.claim;

import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

import static java.util.UUID.randomUUID;

@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class ClaimLine extends BaseEntity {

    private final UUID attachmentId;
    private final ZonedDateTime uploadedAt;
    private final ZonedDateTime validateAt;
    private final UUID validateById;
    private final ZonedDateTime rejectedAt;
    private final UUID rejectedById;
    private final ZonedDateTime cancelledAt;
    private final UUID cancelledById;
    private final ClaimLineStatus status;
    private final String reason;
    private final UUID claimId;

    private ClaimLine(UUID id,
                      UUID attachmentId,
                      ZonedDateTime createdAt,
                      ZonedDateTime uploadedAt,
                      ZonedDateTime validateAt,
                      UUID validateById,
                      ZonedDateTime rejectedAt,
                      UUID rejectedById,
                      ZonedDateTime cancelledAt,
                      UUID cancelledById,
                      ClaimLineStatus status,
                      String reason,
                      UUID claimId) {
        this.id = id;
        this.createdAt = createdAt;
        this.uploadedAt = uploadedAt;
        this.attachmentId = attachmentId;
        this.validateAt = validateAt;
        this.validateById = validateById;
        this.rejectedAt = rejectedAt;
        this.rejectedById = rejectedById;
        this.cancelledAt = cancelledAt;
        this.cancelledById = cancelledById;
        this.status = status;
        this.reason = reason;
        this.claimId = claimId;
    }

    public static ClaimLine create(
                                   UUID attachmentId,
                                   ZonedDateTime createdAt,
                                   ZonedDateTime uploadedAt,
                                   ZonedDateTime validateAt,
                                   UUID validateById,
                                   ZonedDateTime rejectedAt,
                                   UUID rejectedById,
                                   ZonedDateTime cancelledAt,
                                   UUID cancelledById,
                                   ClaimLineStatus status,
                                   String reason,
                                   UUID claimId) {
        return new ClaimLine(
                randomUUID(),
                attachmentId,
                createdAt,
                uploadedAt,
                validateAt,
                validateById ,
                rejectedAt,
                rejectedById,
                cancelledAt,
                cancelledById,
                status,
                reason,
                claimId
        );
    }

    public static ClaimLine create(UUID id,
                                   UUID attachmentId,
                                   ZonedDateTime createdAt,
                                   ZonedDateTime uploadedAt,
                                   ZonedDateTime validateAt,
                                   UUID validateById,
                                   ZonedDateTime rejectedAt,
                                   UUID rejectedById,
                                   ZonedDateTime cancelledAt,
                                   UUID cancelledById,
                                   ClaimLineStatus status,
                                   String reason,
                                   UUID claimId) {
        return new ClaimLine(
                id,
                attachmentId,
                createdAt,
                uploadedAt,
                validateAt,
                validateById ,
                rejectedAt,
                rejectedById,
                cancelledAt,
                cancelledById,
                status,
                reason,
                claimId
        );
    }

    public static List<ClaimLine> create(List<UUID> attachementIds, UUID claimId) {
        return attachementIds.stream().map(attachementId -> create(
                attachementId,
                ZonedDateTime.now(),
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                ClaimLineStatus.DRAFT,
                null,
                claimId
                )).toList();
    }

    public static List<ClaimLine> replace(List<ClaimLine> lines, ClaimLine newClaimLine) {
        return lines.stream().map(line -> {
            if(line.getId().equals(newClaimLine.getId())) {
                return newClaimLine;
            }
            return line;
        }).toList();
    }

    public ClaimLine withClaimId(UUID claimId) {
        return new ClaimLine(
                id,
                attachmentId,
                createdAt,
                uploadedAt,
                validateAt,
                validateById ,
                rejectedAt,
                rejectedById,
                cancelledAt,
                cancelledById,
                status,
                reason,
                claimId
        );
    }

    public ClaimLine withUploaded(ZonedDateTime uploadedAt) {
        return new ClaimLine(
                id,
                attachmentId,
                createdAt,
                uploadedAt,
                validateAt,
                validateById ,
                rejectedAt,
                rejectedById,
                cancelledAt,
                cancelledById,
                ClaimLineStatus.UPLOADED,
                reason,
                claimId
        );
    }

    public ClaimLine withValidate(UUID validateById, ZonedDateTime validateAt) {
        return new ClaimLine(
                id,
                attachmentId,
                createdAt,
                uploadedAt,
                validateAt,
                validateById ,
                rejectedAt,
                rejectedById,
                cancelledAt,
                cancelledById,
                ClaimLineStatus.VALIDATED,
                null,
                claimId
        );
    }

    public ClaimLine withRejected(UUID rejectedById, ZonedDateTime rejectedAt, String reason) {
        if(reason == null || reason.isBlank()) {
            throw new IllegalArgumentException(ClaimMessage.CLAIM_LINE_REASON_REQUIRED);
        }
        return new ClaimLine(
                id,
                attachmentId,
                createdAt,
                uploadedAt,
                validateAt,
                validateById ,
                rejectedAt,
                rejectedById,
                cancelledAt,
                cancelledById,
                ClaimLineStatus.REJECTED,
                reason,
                claimId
        );
    }

    public ClaimLine withCancelled(UUID cancelledById, ZonedDateTime cancelledAt) {
        return new ClaimLine(
                id,
                attachmentId,
                createdAt,
                uploadedAt,
                validateAt,
                validateById ,
                rejectedAt,
                rejectedById,
                cancelledAt,
                cancelledById,
                ClaimLineStatus.CANCELLED,
                reason,
                claimId
        );
    }

    public boolean isUploadStarted() {
        return status != ClaimLineStatus.DRAFT && status != ClaimLineStatus.CANCELLED;
    }

    public boolean isRejected() {
        return status == ClaimLineStatus.REJECTED;
    }

    public ClaimLine withDraft() {
        return new ClaimLine(
                id,
                attachmentId,
                createdAt,
                uploadedAt,
                validateAt,
                validateById ,
                rejectedAt,
                rejectedById,
                cancelledAt,
                cancelledById,
                ClaimLineStatus.DRAFT,
                reason,
                claimId
        );
    }

    public UUID getAttachmentId() { return attachmentId; }
    public ZonedDateTime getValidateAt() { return validateAt; }
    public ZonedDateTime getUploadedAt() { return uploadedAt; }
    public ZonedDateTime getRejectedAt() { return rejectedAt; }
    public ZonedDateTime getCancelledAt() { return cancelledAt; }
    public ClaimLineStatus getStatus() { return status; }
    public String getReason() { return reason; }
    public UUID getClaimId() { return claimId; }
    public UUID getValidateById() { return validateById; }
    public UUID getRejectedById() { return rejectedById; }
    public UUID getCancelledById() { return cancelledById; }

    public boolean notInstructed() {
        return status == ClaimLineStatus.DRAFT || status == ClaimLineStatus.UPLOADED;
    }
}
