package fr.xenonbyte.optifact.backend.infrastructure.claim;

public enum ClaimStateJpa {
    CREATED,
    SUBMITTED,
    IN_INSTRUCTION,
    VALIDATED,
    REJECTED,
    DONE,
    CANCELLED
}
