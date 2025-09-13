package fr.xenonbyte.optifact.backend.infrastructure.claim;

public enum ClaimStateJpa {
    DRAFT,
    SUBMITTED,
    IN_INSTRUCTION,
    REJECTED,
    VALIDATED,
    DONE,
    CANCELLED
}
