package fr.xenonbyte.optifact.backend.application.invoice.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

/**
 * Primary port for deleting invoices by id.
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface DeleteInvoiceByIdUseCase {
    void deleteInvoiceById(UUID invoiceId);
}
