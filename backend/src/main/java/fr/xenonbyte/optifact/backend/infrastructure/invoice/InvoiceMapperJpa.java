package fr.xenonbyte.optifact.backend.infrastructure.invoice;

import fr.xenonbyte.optifact.backend.domain.common.vo.BankAccount;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceLine;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceState;
import fr.xenonbyte.optifact.backend.infrastructure.product.ProductJpa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Mapper
public interface InvoiceMapperJpa {

    @Mapping(target = "actor", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.actor.ActorJpa.builder().id(invoice.getActorId()).build())")
    @Mapping(target = "claim", expression = "java(invoice.getClaimId() == null ? null : fr.xenonbyte.optifact.backend.infrastructure.claim.ClaimJpa.builder().id(invoice.getClaimId()).build())")
    @Mapping(target = "state", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.invoice.InvoiceStateJpa.valueOf(invoice.getState().name()))")
    @Mapping(target = "bankAccountOwner", expression = "java(invoice.getBankAccount() == null ? null : invoice.getBankAccount().getBankAccountOwner())")
    @Mapping(target = "bankName", expression = "java(invoice.getBankAccount() == null ? null : invoice.getBankAccount().getBankName())")
    @Mapping(target = "bankCode", expression = "java(invoice.getBankAccount() == null ? null : invoice.getBankAccount().getBankCode())")
    @Mapping(target = "bankCounter", expression = "java(invoice.getBankAccount() == null ? null : invoice.getBankAccount().getBankCounter())")
    @Mapping(target = "bankAccountNumber", expression = "java(invoice.getBankAccount() == null ? null : invoice.getBankAccount().getBankAccountNumber())")
    @Mapping(target = "bankAccountKey", expression = "java(invoice.getBankAccount() == null ? null : invoice.getBankAccount().getBankAccountKey())")
    @Mapping(target = "lines", expression = "java(toJpaLines(invoice.getLines()))")
    InvoiceJpa toJpa(Invoice invoice);

    @Mapping(target = "lines", ignore = true)
    Invoice toDomain(InvoiceJpa jpa);

    default List<InvoiceLineJpa> toJpaLines(List<InvoiceLine> lines) {
        if (lines == null) return Collections.emptyList();
        List<InvoiceLineJpa> list = new ArrayList<>();
        for (InvoiceLine l : lines) {
            InvoiceLineJpa j = InvoiceLineJpa.builder()
                    .id(l.getId())
                    .createdAt(l.getCreatedAt())
                    .updatedAt(l.getUpdatedAt())
                    .product(ProductJpa.builder().id(l.getProductId()).build())
                    .name(l.getName())
                    .quantity(l.getQuantity())
                    .unitPrice(l.getUnitPrice())
                    .amount(l.getAmount())
                    .invoice(InvoiceJpa.builder().id(l.getInvoiceId()).build())
                    .build();
            list.add(j);
        }
        return list;
    }

    @ObjectFactory
    default Invoice createInvoice(InvoiceJpa jpa) {
        List<InvoiceLine> lines = new ArrayList<>();
        if (jpa.getLines() != null) {
            for (InvoiceLineJpa line : jpa.getLines()) {
                InvoiceLine invoiceLine = InvoiceLine.create(
                        line.getId(),
                        line.getProduct().getId(),
                        line.getName(),
                        line.getQuantity(),
                        line.getUnitPrice(),
                        line.getAmount(),
                        jpa.getId()
                );
                lines.add(invoiceLine);
            }
        }
        BankAccount bankAccount = null;
        if (jpa.getBankAccountOwner() != null) {
            bankAccount = BankAccount.create(
                    jpa.getBankAccountOwner(),
                    jpa.getBankName(),
                    jpa.getBankCode(),
                    jpa.getBankCounter(),
                    jpa.getBankAccountNumber(),
                    jpa.getBankAccountKey()
            );
        }
        BigDecimal amount = jpa.getAmount();
        return Invoice.create(
                jpa.getId(),
                jpa.getReference(),
                jpa.getCreatedAt(),
                jpa.getSendAt(),
                jpa.getActor().getId(),
                jpa.getIssueAt(),
                amount,
                jpa.getClaim() != null ? jpa.getClaim().getId() : null,
                bankAccount,
                InvoiceState.valueOf(jpa.getState().name()),
                lines
        );
    }
}
