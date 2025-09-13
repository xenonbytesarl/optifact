package fr.xenonbyte.optifact.backend.api.common.attachment;

import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.AttachmentApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.AttachmentPageResponseView;
import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.AttachmentResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;
import fr.xenonbyte.optifact.backend.domain.common.attachment.AttachmentScope;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

import java.util.UUID;

@Mapper
public interface AttachmentMapperView {

    Attachment toDomain(AttachmentApiRequestView requestView);

    AttachmentResponseView toResponseView(Attachment domain);

    AttachmentPageResponseView toResponsePageView(Pagination<Attachment> page);

    @ObjectFactory
    default Attachment createAttachment(AttachmentApiRequestView view) {
        AttachmentScope scope = view.getScope() == null ? null : AttachmentScope.valueOf(view.getScope().getValue());
        return Attachment.create(
                view.getFilename(),
                view.getMimeType(),
                view.getAttachmentTypeId(),
                scope,
                view.getResourceId(),
                view.getResourceName(),
                null
        );
    }
}
