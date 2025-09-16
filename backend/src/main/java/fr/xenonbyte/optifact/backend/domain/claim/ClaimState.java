package fr.xenonbyte.optifact.backend.domain.claim;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.VALUE_OBJECT)
@Hexagonal.ValueObject
public enum ClaimState {
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
