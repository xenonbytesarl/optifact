package fr.xenonbyte.optifact.backend.domain.claim;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.VALUE_OBJECT)
@Hexagonal.ValueObject
public enum ClaimState {
    DRAFT,
    SUBMITTED,
    IN_INSTRUCTION,
    REJECTED,
    VALIDATED,
    DONE,
    CANCELLED
}
