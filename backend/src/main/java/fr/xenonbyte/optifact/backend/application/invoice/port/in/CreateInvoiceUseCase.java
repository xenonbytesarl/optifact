package fr.xenonbyte.optifact.backend.application.invoice.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

/**
 * Primary port for creating invoices.
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface CreateInvoiceUseCase {
    Invoice createInvoice(Invoice invoice);
}
