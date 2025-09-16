package fr.xenonbyte.optifact.backend.application.invoice.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.invoice.message.InvoiceMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 16/09/2025
 */
public final class InvoiceIdNotFoundException extends NotFoundException {
    public InvoiceIdNotFoundException(UUID invoiceId) {
        super(InvoiceMessage.INVOICE_ID_NOT_FOUND, invoiceId);
    }
}
