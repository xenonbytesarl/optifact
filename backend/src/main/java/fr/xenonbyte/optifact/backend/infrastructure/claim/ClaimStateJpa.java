package fr.xenonbyte.optifact.backend.infrastructure.claim;

public enum ClaimStateJpa {
    DRAFT,
    SUBMITTED,
    IN_INSTRUCTION,
    INSTRUCTION_REJECTED,
    INSTRUCTION_DONE,
    COMPLETE_COMPLIANT,
    AGREEMENT_REFUSED,
    AGREEMENT_GRANTED,
    AGREEMENT_ADJOURNED,
    CANCELLED
}
