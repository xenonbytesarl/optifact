package fr.xenonbyte.optifact.backend.domain.common.attachment;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

/**
 * Attachment type for a claim.
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.VALUE_OBJECT)
@Hexagonal.ValueObject
public enum AttachmentType {
    EXTERNAL,
    INTERNAL
}
