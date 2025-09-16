package fr.xenonbyte.optifact.backend.api.invoice;

import fr.xenonbyte.optifact.backend.api.invoice.generated.view.*;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.vo.BankAccount;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceLine;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceState;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Currency;
import java.util.List;

@Mapper
public interface InvoiceMapperView {

    default InvoiceStateView mapState(InvoiceState state) {
        if (state == null) return null;
        return switch (state) {
            case DRAFT -> InvoiceStateView.DRAFT;
            case VALIDATE -> InvoiceStateView.VALIDATE;
            case PAID -> InvoiceStateView.PAID;
            case CANCEL -> InvoiceStateView.CANCEL;
        };
    }

    @Mapping(target = "lines", expression = "java(toResponseLines(domain.getLines()))")
    @Mapping(target = "bankAccount", expression = "java(toView(domain.getBankAccount()))")
    InvoiceResponseView toResponseView(Invoice domain);

    InvoicePageResponseView toResponsePageView(Pagination<Invoice> page);

    default BankAccountView toView(BankAccount bank) {
        if (bank == null) return null;
        BankAccountView view = new BankAccountView();
        view.setBankAccountOwner(bank.getBankAccountOwner());
        view.setBankName(bank.getBankName());
        view.setBankCode(bank.getBankCode());
        view.setBankCounter(bank.getBankCounter());
        view.setBankAccountNumber(bank.getBankAccountNumber());
        view.setBankAccountKey(bank.getBankAccountKey());
        return view;
    }

    default List<InvoiceLineResponseView> toResponseLines(List<InvoiceLine> lines) {
        if (lines == null) return Collections.emptyList();
        List<InvoiceLineResponseView> list = new ArrayList<>();
        for (InvoiceLine l : lines) {
            InvoiceLineResponseView v = new InvoiceLineResponseView();
            v.setId(l.getId());
            v.setCreatedAt(l.getCreatedAt() == null ? null : l.getCreatedAt().toOffsetDateTime());
            v.setUpdatedAt(l.getUpdatedAt() == null ? null : l.getUpdatedAt().toOffsetDateTime());
            v.setProductId(l.getProductId());
            v.setName(l.getName());
            v.setQuantity(l.getQuantity());
            v.setUnitPrice(l.getUnitPrice());
            v.setUnitPriceCurrency(l.getUnitPriceCurrency().getCurrencyCode());
            v.setAmount(l.getAmount());
            v.setAmountCurrency(l.getAmountCurrency().getCurrencyCode());
            list.add(v);
        }
        return list;
    }

    @ObjectFactory
    default Invoice createInvoice(InvoiceApiRequestView view) {
        BankAccount bank = null;
        if (view.getBankAccount() != null) {
            bank = BankAccount.create(
                    view.getBankAccount().getBankAccountOwner(),
                    view.getBankAccount().getBankName(),
                    view.getBankAccount().getBankCode(),
                    view.getBankAccount().getBankCounter(),
                    view.getBankAccount().getBankAccountNumber(),
                    view.getBankAccount().getBankAccountKey()
            );
        }
        List<InvoiceLine> lines = new ArrayList<>();
        if (view.getLines() != null) {
            for (InvoiceLineRequestView l : view.getLines()) {
                InvoiceLine dl = InvoiceLine.create(
                        l.getProductId(),
                        l.getName(),
                        l.getQuantity(),
                        l.getUnitPrice(),
                        Currency.getInstance(l.getUnitPriceCurrency()),
                        l.getAmount(),
                        Currency.getInstance(l.getAmountCurrency()),
                        null
                );
                dl.computeAmount();
                lines.add(dl);
            }
        }
        Invoice invoice = Invoice.create(
                view.getReference(),
                view.getCreatedAt() == null ? null : view.getCreatedAt().toZonedDateTime(),
                view.getSendAt() == null ? null : view.getSendAt().toZonedDateTime(),
                view.getActorId(),
                view.getDueAt() == null ? null : view.getDueAt().toZonedDateTime(),
                null,
                Currency.getInstance(view.getAmountCurrency()),
                view.getClaimId(),
                bank,
                view.getState() == null ? null : InvoiceState.valueOf(view.getState().name()),
                lines
        );
        return invoice.computeAmount();
    }

    @ObjectFactory
    default Invoice createInvoice(UpdateInvoiceApiRequestView view) {
        BankAccount bank = null;
        if (view.getBankAccount() != null) {
            bank = BankAccount.create(
                    view.getBankAccount().getBankAccountOwner(),
                    view.getBankAccount().getBankName(),
                    view.getBankAccount().getBankCode(),
                    view.getBankAccount().getBankCounter(),
                    view.getBankAccount().getBankAccountNumber(),
                    view.getBankAccount().getBankAccountKey()
            );
        }
        List<InvoiceLine> lines = new ArrayList<>();
        if (view.getLines() != null) {
            for (UpdateInvoiceLineRequestView l : view.getLines()) {
                InvoiceLine dl = (l.getId() == null)
                        ? InvoiceLine.create(l.getProductId(), l.getName(), l.getQuantity(), l.getUnitPrice(), Currency.getInstance(l.getUnitPriceCurrency()), l.getAmount(), Currency.getInstance(l.getAmountCurrency()), null)
                        : InvoiceLine.create(l.getId(), l.getProductId(), l.getName(), l.getQuantity(), l.getUnitPrice(), Currency.getInstance(l.getUnitPriceCurrency()), l.getAmount(), Currency.getInstance(l.getAmountCurrency()), null);
                dl.computeAmount();
                lines.add(dl);
            }
        }
        return Invoice.create(
                view.getReference(),
                null,
                view.getSendAt() == null ? null : view.getSendAt().toZonedDateTime(),
                view.getActorId(),
                view.getDueAt() == null ? null : view.getDueAt().toZonedDateTime(),
                null,
                Currency.getInstance(view.getAmountCurrency()),
                view.getClaimId(),
                bank,
                view.getState() == null ? null : InvoiceState.valueOf(view.getState().name()),
                lines
        );
    }
}
