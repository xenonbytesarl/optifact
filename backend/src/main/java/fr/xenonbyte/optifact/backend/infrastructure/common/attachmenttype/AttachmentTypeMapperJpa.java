package fr.xenonbyte.optifact.backend.infrastructure.common.attachmenttype;

import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Mapper
public interface AttachmentTypeMapperJpa {

    AttachmentTypeJpa toJpa(AttachmentType attachmentType);
    AttachmentType toDomain(AttachmentTypeJpa attachmentTypeJpa);

    @ObjectFactory
    default AttachmentType createAttachmentType(AttachmentTypeJpa attachmentTypeJpa) {
        return AttachmentType.create(
                attachmentTypeJpa.getId(),
                attachmentTypeJpa.getCreatedAt(),
                attachmentTypeJpa.getUpdatedAt(),
                attachmentTypeJpa.getName(),
                attachmentTypeJpa.getActive()
        );
    }
}
