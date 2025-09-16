package fr.xenonbyte.optifact.backend.domain.invoice;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.common.vo.BankAccount;
import fr.xenonbyte.optifact.backend.domain.invoice.message.InvoiceMessage;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.util.UUID.randomUUID;

@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Invoice extends BaseEntity {

    public static final String DEFAULT_INVOICE_CODE = "INVOICE";

    private final String reference;
    private final ZonedDateTime sendAt;
    private final UUID actorId;
    private final ZonedDateTime issueAt;
    private final BigDecimal amount;
    private final UUID claimId;
    private final BankAccount bankAccount;
    private final InvoiceState state;
    private final List<InvoiceLine> lines;

    private Invoice(UUID id,
                    String reference,
                    ZonedDateTime createdAt,
                    ZonedDateTime sendAt,
                    UUID actorId,
                    ZonedDateTime issueAt,
                    BigDecimal amount,
                    UUID claimId,
                    BankAccount bankAccount,
                    InvoiceState state,
                    List<InvoiceLine> lines) {
        this.id = id;
        this.reference = reference;
        this.createdAt = createdAt;
        this.sendAt = sendAt;
        this.actorId = actorId;
        this.issueAt = issueAt;
        this.amount = amount;
        this.claimId = claimId;
        this.bankAccount = bankAccount;
        this.state = state;
        this.lines = List.copyOf(lines);
    }

    public static Invoice create(String reference,
                                 ZonedDateTime createdAt,
                                 ZonedDateTime sendAt,
                                 UUID actorId,
                                 ZonedDateTime issueAt,
                                 BigDecimal amount,
                                 UUID claimId,
                                 BankAccount bankAccount,
                                 InvoiceState state,
                                 List<InvoiceLine> lines) {
        validate(actorId, amount, lines);
        UUID id = randomUUID();
        List<InvoiceLine> normalized = attachInvoiceIdToLines(lines, id);
        return new Invoice(
                id,
                reference,
                createdAt,
                sendAt,
                actorId,
                issueAt,
                amount,
                claimId,
                bankAccount,
                state == null ? InvoiceState.DRAFT : state,
                normalized
        );
    }

    public static Invoice create(UUID id,
                                 String reference,
                                 ZonedDateTime createdAt,
                                 ZonedDateTime sendAt,
                                 UUID actorId,
                                 ZonedDateTime issueAt,
                                 BigDecimal amount,
                                 UUID claimId,
                                 BankAccount bankAccount,
                                 InvoiceState state,
                                 List<InvoiceLine> lines) {
        validate(actorId, amount, lines);
        List<InvoiceLine> normalized = attachInvoiceIdToLines(lines, id);
        return new Invoice(
                id,
                reference,
                createdAt,
                sendAt,
                actorId,
                issueAt,
                amount,
                claimId,
                bankAccount,
                state == null ? InvoiceState.DRAFT : state,
                normalized
        );
    }


    public Invoice computeAmount() {
        BigDecimal amount = this.lines.stream().map(InvoiceLine::getAmount)
                .reduce(BigDecimal::add).orElse(BigDecimal.ZERO);
        validateAmount(amount);
        return withAmount(amount);
    }

    public void checkDeletable() {
        if(!state.equals(InvoiceState.DRAFT))
            throw new IllegalStateException(InvoiceMessage.INVOICE_DELETABLE_WHEN_STATE_DRAFT);
    }

    public Invoice update(String reference, ZonedDateTime sendAt, UUID actorId, ZonedDateTime issueAt, UUID claimId, BankAccount bankAccount, InvoiceState state, List<InvoiceLine> lines) {
        validate(actorId, amount, lines);
        lines = attachInvoiceIdToLines(lines, id);
        Invoice invoice = new Invoice(id, reference, createdAt, sendAt, actorId, issueAt, amount, claimId, bankAccount, state, lines);
        invoice.updateAudit(createdAt);
        return invoice;
    }

    private static void validate(UUID actorId, BigDecimal amount, List<InvoiceLine> lines) {
        if (actorId == null) throw new IllegalArgumentException(InvoiceMessage.INVOICE_ACTOR_ID_REQUIRED);
        if (lines == null || lines.isEmpty()) throw new IllegalArgumentException(InvoiceMessage.INVOICE_LINES_REQUIRED);
    }

    private void validateAmount(BigDecimal amount) {
        if (amount != null && amount.signum() < 0) throw new IllegalArgumentException(InvoiceMessage.INVOICE_AMOUNT_INVALID);
    }

    private static List<InvoiceLine> attachInvoiceIdToLines(List<InvoiceLine> lines, UUID invoiceId) {
        return lines.stream().map(line -> line.withInvoiceId(invoiceId)).toList();
    }

    private Invoice withAmount(BigDecimal amount) {
        return new Invoice(id, reference, createdAt, sendAt, actorId, issueAt, amount, claimId, bankAccount, state, lines);
    }

    public Invoice withReference(String reference) {
        return new Invoice(id, reference, createdAt, sendAt, actorId, issueAt, amount, claimId, bankAccount, state, lines);
    }

    public String getReference() {
        return reference;
    }

    public ZonedDateTime getSendAt() {
        return sendAt;
    }

    public UUID getActorId() {
        return actorId;
    }

    public ZonedDateTime getIssueAt() {
        return issueAt;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public UUID getClaimId() {
        return claimId;
    }

    public BankAccount getBankAccount() {
        return bankAccount;
    }

    public InvoiceState getState() {
        return state;
    }

    public List<InvoiceLine> getLines() {
        return lines;
    }

}
