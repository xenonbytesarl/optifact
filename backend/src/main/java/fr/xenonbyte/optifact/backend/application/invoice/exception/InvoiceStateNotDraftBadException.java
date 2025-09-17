package fr.xenonbyte.optifact.backend.application.invoice.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.BadException;
import fr.xenonbyte.optifact.backend.domain.invoice.message.InvoiceMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
public final class InvoiceStateNotDraftBadException extends BadException {
    public InvoiceStateNotDraftBadException() {
        super(InvoiceMessage.INVOICE_STATE_NOT_DRAFT);
    }
}
