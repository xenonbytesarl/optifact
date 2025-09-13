package fr.xenonbyte.optifact.backend.api.common.attachment;

import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.AttachmentApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.AttachmentPageResponseView;
import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.AttachmentResponseView;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.CreateAttachmentUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.DeleteAttachmentByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.FindAttachmentByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.SearchAttachmentsUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.UpdateAttachmentUseCase;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;

import java.util.List;
import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public class AttachmentAdapterView {

    private final CreateAttachmentUseCase createUseCase;
    private final UpdateAttachmentUseCase updateUseCase;
    private final FindAttachmentByIdUseCase findByIdUseCase;
    private final DeleteAttachmentByIdUseCase deleteByIdUseCase;
    private final SearchAttachmentsUseCase searchUseCase;
    private final AttachmentMapperView mapperView;

    public AttachmentAdapterView(CreateAttachmentUseCase createUseCase,
                                 UpdateAttachmentUseCase updateUseCase,
                                 FindAttachmentByIdUseCase findByIdUseCase,
                                 DeleteAttachmentByIdUseCase deleteByIdUseCase,
                                 SearchAttachmentsUseCase searchUseCase,
                                 AttachmentMapperView mapperView) {
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.findByIdUseCase = findByIdUseCase;
        this.deleteByIdUseCase = deleteByIdUseCase;
        this.searchUseCase = searchUseCase;
        this.mapperView = mapperView;
    }

    public AttachmentResponseView createAttachment(AttachmentApiRequestView view) {
        return mapperView.toResponseView(createUseCase.createAttachment(mapperView.toDomain(view)));
    }

    public AttachmentResponseView updateAttachment(UUID id, AttachmentApiRequestView view) {
        return mapperView.toResponseView(updateUseCase.updateAttachment(id, mapperView.toDomain(view)));
    }

    public void deleteAttachmentById(UUID id) {
        deleteByIdUseCase.deleteAttachmentById(id);
    }

    public AttachmentResponseView findAttachmentById(UUID id) {
        return mapperView.toResponseView(findByIdUseCase.findAttachmentById(id));
    }

    public AttachmentPageResponseView searchAttachments(String filenameFilter,
                                                        Integer page,
                                                        Integer size,
                                                        String sortField,
                                                        String sortDirection,
                                                        String attachmentTypeName) {
        long safePage = page == null ? 0L : page.longValue();
        long safeSize = size == null ? 20L : size.longValue();
        String safeSort = (sortField == null || sortField.isBlank()) ? "createdAt" : sortField;
        Direction safeDirection;
        if (sortDirection == null) {
            safeDirection = Direction.ASC;
        } else {
            try { safeDirection = Direction.valueOf(sortDirection.trim().toUpperCase()); }
            catch (IllegalArgumentException ex) { safeDirection = Direction.ASC; }
        }

        Pagination<Attachment> pageResult = searchUseCase.searchAttachments(
                filenameFilter,
                attachmentTypeName,
                new CommonSearch(safePage, safeSize, safeSort, safeDirection)
        );
        return mapperView.toResponsePageView(pageResult);
    }
}
