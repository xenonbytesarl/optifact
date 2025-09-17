package fr.xenonbyte.optifact.backend.domain.invoice;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.invoice.message.InvoiceMessage;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.UUID;

import static java.util.UUID.randomUUID;

@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class InvoiceLine extends BaseEntity {

    private final UUID productId;
    private final String name;
    private final Double quantity;
    private final BigDecimal unitPrice;
    private final Currency unitPriceCurrency;
    private final BigDecimal amount;
    private final Currency amountCurrency;
    private final UUID invoiceId;

    private InvoiceLine(UUID id,
                        UUID productId,
                        String name,
                        Double quantity,
                        BigDecimal unitPrice,
                        Currency unitPriceCurrency,
                        BigDecimal amount,
                        Currency amountCurrency,
                        UUID invoiceId) {
        this.id = id;
        this.productId = productId;
        this.name = name;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.unitPriceCurrency = unitPriceCurrency;
        this.amount = amount;
        this.amountCurrency = amountCurrency;
        this.invoiceId = invoiceId;
    }

    public static InvoiceLine create(UUID productId,
                                     String name,
                                     Double quantity,
                                     BigDecimal unitPrice,
                                     Currency unitPriceCurrency,
                                     BigDecimal amount,
                                     Currency amountCurrency,
                                     UUID invoiceId) {
        validate(productId, name, quantity, unitPrice);
        return new InvoiceLine(
                randomUUID(),
                productId,
                name.trim(),
                quantity,
                unitPrice,
                unitPriceCurrency,
                amount,
                amountCurrency,
                invoiceId
        );
    }

    public static InvoiceLine create(UUID id,
                                     UUID productId,
                                     String name,
                                     Double quantity,
                                     BigDecimal unitPrice,
                                     Currency unitPriceCurrency,
                                     BigDecimal amount,
                                     Currency amountCurrency,
                                     UUID invoiceId) {
        validate(productId, name, quantity, unitPrice);
        return new InvoiceLine(
                id,
                productId,
                name.trim(),
                quantity,
                unitPrice,
                unitPriceCurrency,
                amount,
                amountCurrency,
                invoiceId
        );
    }

    public InvoiceLine update(UUID productId, String name, Double quantity, BigDecimal unitPrice, Currency unitPriceCurrency, BigDecimal amount, Currency amountCurrency) {
        InvoiceLine invoiceLine = new InvoiceLine(this.id, productId, name, quantity, unitPrice, unitPriceCurrency, amount, amountCurrency, this.invoiceId);
        invoiceLine.updateAudit(this.createdAt);
        return invoiceLine;
    }

    public InvoiceLine withInvoiceId(UUID invoiceId) {
        return new InvoiceLine(this.id, this.productId, this.name, this.quantity, this.unitPrice, this.unitPriceCurrency, this.amount, this.amountCurrency, invoiceId);
    }

    private static void validate(UUID productId,
                                 String name,
                                 Double quantity,
                                 BigDecimal unitPrice) {
        if (productId == null) throw new IllegalArgumentException(InvoiceMessage.INVOICE_LINE_PRODUCT_ID_REQUIRED);
        if (name == null || name.isBlank()) throw new IllegalArgumentException(InvoiceMessage.INVOICE_LINE_NAME_REQUIRED);
        if (quantity == null) throw new IllegalArgumentException(InvoiceMessage.INVOICE_LINE_QUANTITY_REQUIRED);
        if (quantity <= 0) throw new IllegalArgumentException(InvoiceMessage.INVOICE_LINE_QUANTITY_INVALID);
        if (unitPrice == null) throw new IllegalArgumentException(InvoiceMessage.INVOICE_LINE_UNIT_PRICE_REQUIRED);
        if (unitPrice.signum() < 0) throw new IllegalArgumentException(InvoiceMessage.INVOICE_LINE_UNIT_PRICE_INVALID);
    }

    private void validateAmount(BigDecimal amount) {
        if (amount != null && amount.signum() < 0) throw new IllegalArgumentException(InvoiceMessage.INVOICE_LINE_AMOUNT_INVALID);
    }

    public InvoiceLine computeAmount() {
        BigDecimal amount = this.unitPrice.multiply(BigDecimal.valueOf(this.quantity));
        validateAmount(amount);
        return withAmount(amount, amountCurrency);
    }

    public InvoiceLine withAmount(BigDecimal amount, Currency amountCurrency) {
        return new InvoiceLine(this.id, this.productId, this.name, this.quantity, this.unitPrice, this.unitPriceCurrency, amount, amountCurrency, this.invoiceId);
    }

    public UUID getProductId() {
        return productId;
    }

    public String getName() {
        return name;
    }

    public Double getQuantity() {
        return quantity;
    }

    public BigDecimal getUnitPrice() {
        return unitPrice;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public UUID getInvoiceId() {
        return invoiceId;
    }

    public Currency getUnitPriceCurrency() {
        return unitPriceCurrency;
    }

    public Currency getAmountCurrency() {
        return amountCurrency;
    }

    public InvoiceLine updateOrCreate() {
        if( this.id != null) {
            return update(this.productId, this.name, this.quantity, this.unitPrice, this.unitPriceCurrency, this.amount, this.amountCurrency);
        }
        return create(this.productId, this.name, this.quantity, this.unitPrice, this.unitPriceCurrency, this.amount, this.amountCurrency, this.invoiceId);
    }
}
