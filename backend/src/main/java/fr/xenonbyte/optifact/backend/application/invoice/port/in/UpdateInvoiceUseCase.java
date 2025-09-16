package fr.xenonbyte.optifact.backend.application.invoice.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.util.UUID;

/**
 * Primary port for updating invoices.
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface UpdateInvoiceUseCase {
    Invoice updateInvoice(UUID invoiceId, Invoice invoice);
}
