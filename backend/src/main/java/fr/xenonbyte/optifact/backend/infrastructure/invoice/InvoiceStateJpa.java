package fr.xenonbyte.optifact.backend.infrastructure.invoice;

public enum InvoiceStateJpa {
    DRAFT,
    VALIDATE,
    PAID,
    CANCEL
}
