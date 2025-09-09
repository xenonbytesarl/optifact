package fr.xenonbyte.optifact.backend.api.common.attachmenttype;


import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.AttachmentTypeApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.AttachmentTypePageResponseView;
import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.AttachmentTypeResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

/**
 * @author bamk
 * @version 1.0
 * @since 10/09/2025
 */
@Mapper
public interface AttachmentTypeMapperView {

    AttachmentType toDomain(AttachmentTypeApiRequestView requestView);

    AttachmentTypeResponseView toResponseView(AttachmentType attachmentType);

    AttachmentTypePageResponseView toResponsePageView(Pagination<AttachmentType> attachmentTypePage);

    @ObjectFactory
    default AttachmentType createAttachmentType(AttachmentTypeApiRequestView requestView) {
        return AttachmentType.create(requestView.getName());
    }
}
