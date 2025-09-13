package fr.xenonbyte.optifact.backend.infrastructure.common.attachment;

import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;
import fr.xenonbyte.optifact.backend.domain.common.attachment.AttachmentScope;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

@Mapper
public interface AttachmentMapperJpa {

    @Mapping(target = "attachmentType", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.common.attachmenttype.AttachmentTypeJpa.builder().id(attachment.getAttachmentTypeId()).build())")
    @Mapping(target = "type", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.common.attachment.AttachmentScopeJpa.valueOf(attachment.getScope().name()))")
    AttachmentJpa toJpa(Attachment attachment);
    Attachment toDomain(AttachmentJpa jpa);

    @ObjectFactory
    default Attachment createAttachment(AttachmentJpa jpa) {
        return Attachment.create(
                jpa.getId(),
                jpa.getFilename(),
                jpa.getMimeType(),
                jpa.getAttachmentType().getId(),
                AttachmentScope.valueOf(jpa.getType().name()),
                jpa.getResourceId(),
                jpa.getResourceName(),
                jpa.getCreatedById()
        );
    }
}
