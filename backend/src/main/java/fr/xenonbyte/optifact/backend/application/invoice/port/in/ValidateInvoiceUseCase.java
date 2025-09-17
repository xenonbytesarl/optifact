package fr.xenonbyte.optifact.backend.application.invoice.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface ValidateInvoiceUseCase {
    Invoice validateInvoice(UUID invoiceId);
}
