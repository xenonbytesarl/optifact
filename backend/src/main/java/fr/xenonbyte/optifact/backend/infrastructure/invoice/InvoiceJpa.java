package fr.xenonbyte.optifact.backend.infrastructure.invoice;

import fr.xenonbyte.optifact.backend.infrastructure.actor.ActorJpa;
import fr.xenonbyte.optifact.backend.infrastructure.claim.ClaimJpa;
import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_invoice")
public class InvoiceJpa extends BaseEntityJpa {

    @ManyToOne
    @JoinColumn(name = "c_actor_id", nullable = false)
    private ActorJpa actor;

    @ManyToOne
    @JoinColumn(name = "c_claim_id")
    private ClaimJpa claim;

    @Column(name = "c_reference", nullable = false, unique = true)
    private String reference;

    @Column(name = "c_send_at")
    private ZonedDateTime sendAt;

    @Column(name = "c_issue_at")
    private ZonedDateTime issueAt;

    @Column(name = "c_amount")
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(name = "c_state", nullable = false)
    private InvoiceStateJpa state;

    // Bank account fields (denormalized for the invoice snapshot)
    @Column(name = "c_bank_account_owner")
    private String bankAccountOwner;

    @Column(name = "c_bank_name")
    private String bankName;

    @Column(name = "c_bank_code")
    private String bankCode;

    @Column(name = "c_bank_counter")
    private String bankCounter;

    @Column(name = "c_bank_account_number")
    private String bankAccountNumber;

    @Column(name = "c_bank_account_key")
    private String bankAccountKey;

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<InvoiceLineJpa> lines;
}
