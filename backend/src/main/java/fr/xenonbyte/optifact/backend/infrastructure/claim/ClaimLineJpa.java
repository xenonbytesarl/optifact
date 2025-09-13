package fr.xenonbyte.optifact.backend.infrastructure.claim;

import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import fr.xenonbyte.optifact.backend.infrastructure.common.attachment.AttachmentJpa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_claim_line")
public class ClaimLineJpa extends BaseEntityJpa {

    @ManyToOne
    @JoinColumn(name = "c_attachment_id")
    private AttachmentJpa attachment;

    @Column(name = "c_uploaded_at")
    private ZonedDateTime uploadedAt;

    @Column(name = "c_validate_at")
    private ZonedDateTime validateAt;

    @Column(name = "c_validate_by_id")
    private UUID validateById;

    @Column(name = "c_rejected_at")
    private ZonedDateTime rejectedAt;

    @Column(name = "c_rejected_by_id")
    private UUID rejectedById;

    @Column(name = "c_cancelled_at")
    private ZonedDateTime cancelledAt;

    @Column(name = "c_cancelled_by_id")
    private UUID cancelledById;

    @Enumerated(EnumType.STRING)
    @Column(name = "c_status", nullable = false)
    private ClaimLineStatusJpa status;

    @Column(name = "c_reason")
    private String reason;

    @ManyToOne
    @JoinColumn(name = "c_claim_id", nullable = false)
    private ClaimJpa claim;
}
