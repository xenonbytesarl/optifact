package fr.xenonbyte.optifact.backend.domain.invoice;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

/**
 * Simple state lifecycle for Invoice.
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
public enum InvoiceState {
    DRAFT,
    VALIDATE,
    PAID,
    CANCEL
}
