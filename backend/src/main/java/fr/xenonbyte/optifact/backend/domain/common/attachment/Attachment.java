package fr.xenonbyte.optifact.backend.domain.common.attachment;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.message.AttachmentMessage;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;

import java.util.UUID;

/**
 * Attachment aggregate root for claim resources.
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Attachment extends BaseEntity {

    private final String filename;
    private final String mimeType;
    private final UUID attachmentTypeId;
    private final AttachmentScope scope;
    private final UUID resourceId;
    private final String resourceName;
    private final UUID createdById;

    private Attachment(UUID id,
                       String filename,
                       String mimeType,
                       UUID attachmentTypeId,
                       AttachmentScope scope,
                       UUID resourceId,
                       String resourceName,
                       UUID createdById) {
        this.id = id;
        this.filename = filename;
        this.mimeType = mimeType;
        this.attachmentTypeId = attachmentTypeId;
        this.scope = scope;
        this.resourceId = resourceId;
        this.resourceName = resourceName;
        this.createdById = createdById;
    }

    public static Attachment create(UUID id,
                                    String filename,
                                    String mimeType,
                                    UUID attachmentTypeId,
                                    AttachmentScope type,
                                    UUID resourceId,
                                    String resourceName,
                                    UUID createdById) {
        return new Attachment(id, filename, mimeType, attachmentTypeId, type, resourceId, resourceName, createdById);
    }

    public static Attachment create(String filename,
                                    String mimeType,
                                    UUID attachmentTypeId,
                                    AttachmentScope type,
                                    UUID resourceId,
                                    String resourceName,
                                    UUID createdBy) {
        validateParams(attachmentTypeId);
        // TODO validate createdBy when security will be implemented
        return new Attachment(UUID.randomUUID(), filename, mimeType, attachmentTypeId, type, resourceId, resourceName, createdBy);
    }

    private static void validateParams(UUID attachmentTypeId) {
        if(attachmentTypeId == null) {
            throw new IllegalArgumentException(AttachmentMessage.ATTACHMENT_TYPE_ID_REQUIRED);
        }
    }

    public Attachment update(String filename,
                             String mimeType,
                             UUID attachmentTypeId,
                             AttachmentScope type,
                             UUID resourceId,
                             String resourceName) {
        validateParams(attachmentTypeId);
        Attachment attachment = new Attachment(id, filename, mimeType, attachmentTypeId, type, resourceId, resourceName, createdById);
        attachment.updateAudit(createdAt);
        return attachment;

    }

    public String getFilename() { return filename; }
    public String getMimeType() { return mimeType; }
    public UUID getAttachmentTypeId() { return attachmentTypeId; }
    public AttachmentScope getScope() { return scope; }
    public UUID getResourceId() { return resourceId; }
    public String getResourceName() { return resourceName; }
    public UUID getCreatedById() { return createdById; }
}
