package fr.xenonbyte.optifact.backend.domain.invoice.message;

/**
 * Validation and domain message keys for Invoice and InvoiceLine.
 */
public final class InvoiceMessage {


    private InvoiceMessage() {}

    // Invoice (domain validation)
    public static final String INVOICE_ACTOR_ID_REQUIRED = "invoice.actor.id.required";
    public static final String INVOICE_AMOUNT_INVALID = "invoice.amount.invalid"; // the amount must be >= 0
    public static final String INVOICE_LINES_REQUIRED = "invoice.lines.required";

    // InvoiceLine (domain validation)
    public static final String INVOICE_LINE_PRODUCT_ID_REQUIRED = "invoice.line.product.id.required";
    public static final String INVOICE_LINE_NAME_REQUIRED = "invoice.line.name.required";
    public static final String INVOICE_LINE_QUANTITY_REQUIRED = "invoice.line.quantity.required";
    public static final String INVOICE_LINE_QUANTITY_INVALID = "invoice.line.quantity.invalid"; // > 0
    public static final String INVOICE_LINE_UNIT_PRICE_INVALID = "invoice.line.unit.price.invalid"; // >= 0
    public static final String INVOICE_LINE_UNIT_PRICE_REQUIRED = "invoice.line.unit.price.required";
    public static final String INVOICE_LINE_AMOUNT_INVALID = "invoice.line.amount.invalid"; // >= 0
}
