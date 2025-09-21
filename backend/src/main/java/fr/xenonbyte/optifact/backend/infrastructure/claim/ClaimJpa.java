package fr.xenonbyte.optifact.backend.infrastructure.claim;

import fr.xenonbyte.optifact.backend.infrastructure.actor.ActorJpa;
import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import fr.xenonbyte.optifact.backend.infrastructure.common.attachment.AttachmentJpa;
import fr.xenonbyte.optifact.backend.infrastructure.product.ProductJpa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_claim")
public class ClaimJpa extends BaseEntityJpa {

    @ManyToOne
    @JoinColumn(name = "c_actor_id", nullable = false)
    private ActorJpa actor;

    @ManyToOne
    @JoinColumn(name = "c_product_id", nullable = false)
    private ProductJpa product;

    @Column(name = "c_submit_at")
    private ZonedDateTime submitAt;

    @Column(name = "c_manager_quote_id")
    private UUID managerQuoteId;

    @Column(name = "c_in_instruction_at")
    private ZonedDateTime inInstructionAt;

    @Column(name = "c_instructor_id")
    private UUID instructorId;

    @Column(name = "c_instruction_done_at")
    private ZonedDateTime instructionDoneAt;

    @Column(name = "c_instruction_rejected_at")
    private ZonedDateTime instructionRejectedAt;

    @Column(name = "c_agreement_by_id")
    private UUID agreementById;

    @Column(name = "c_manager_compliant_by_id")
    private UUID managerCompliantById;

    @Column(name = "c_compliant_at")
    private ZonedDateTime compliantAt;

    @Column(name = "c_agreement_granted_at")
    private ZonedDateTime agreementGrantedAt;

    @Column(name = "c_agreement_refused_at")
    private ZonedDateTime agreementRefusedAt;

    @Column(name = "c_agreement_adjourned_at")
    private ZonedDateTime agreementAdjournedAt;

    @Column(name = "c_cancel_by_id")
    private UUID cancelById;

    @Column(name = "c_cancel_at")
    private ZonedDateTime cancelAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "c_state", nullable = false)
    private ClaimStateJpa state;

    @Column(name = "c_reference", nullable = false, unique = true)
    private String reference;

    @ManyToOne
    @JoinColumn(name = "c_granted_agreement_attachment_id")
    private AttachmentJpa grantedAgreementAttachment;

    @ManyToOne
    @JoinColumn(name = "c_refused_agreement_attachment_id")
    private AttachmentJpa refusedAgreementAttachment;

    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClaimLineJpa> lines;
}
