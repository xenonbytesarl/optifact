package fr.xenonbyte.optifact.backend.application.invoice.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.util.UUID;

/**
 * Primary port to find invoice by id.
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface FindInvoiceByIdUseCase {
    Invoice findInvoiceById(UUID invoiceId);
}
