package fr.xenonbyte.optifact.backend.domain.common.attachementtype;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.message.AttachementTypeMessage;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;

import java.time.ZonedDateTime;
import java.util.UUID;

import static java.util.UUID.randomUUID;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class AttachementType extends BaseEntity {
    private final String name;
    private final Boolean active;

    private AttachementType(UUID id, String name, Boolean active) {
        this.id = id;
        this.name = name;
        this.active = active;
    }

    public static AttachementType create(String name) {
        validateParam(name);

        return new AttachementType(randomUUID(), name, true);
    }

    public static AttachementType create(UUID id, ZonedDateTime createdAt, ZonedDateTime updatedAt, String name, Boolean active) {
        validateParam(name);
        AttachementType attachmentType = new AttachementType(id, name, active);
        attachmentType.updateAudit(createdAt, updatedAt);
        return attachmentType;
    }

    public AttachementType update(String name) {
        validateParam(name);
        AttachementType attachmentType = new AttachementType(id, name, true);
        attachmentType.updateAudit(createdAt);
        return attachmentType;
    }

    public AttachementType withActive(Boolean active) {
        AttachementType attachmentType = new AttachementType(id, name, active);
        attachmentType.updateAudit(createdAt);
        return attachmentType;
    }

    public String getName() {
        return name;
    }

    public Boolean getActive() {
        return active;
    }

    private static void validateParam(String name) {
        if(name == null || name.isBlank()) {
            throw new IllegalArgumentException(AttachementTypeMessage.ATTACHMENT_TYPE_NAME_REQUIRED);
        }
    }
}
