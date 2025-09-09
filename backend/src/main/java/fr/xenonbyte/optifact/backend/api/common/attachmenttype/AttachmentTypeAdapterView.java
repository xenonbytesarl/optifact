package fr.xenonbyte.optifact.backend.api.common.attachmenttype;


import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.AttachmentTypeApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.AttachmentTypePageResponseView;
import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.AttachmentTypeResponseView;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.CreateAttachmentTypeUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.DeleteAttachmentTypeByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.FindAttachmentTypeByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.SearchAttachmentTypesUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.UpdateAttachmentTypeUseCase;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 10/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public class AttachmentTypeAdapterView {
    private final CreateAttachmentTypeUseCase createAttachmentTypeUseCase;
    private final UpdateAttachmentTypeUseCase updateAttachmentTypeUseCase;
    private final FindAttachmentTypeByIdUseCase findAttachmentTypeByIdUseCase;
    private final DeleteAttachmentTypeByIdUseCase deleteAttachmentTypeByIdUseCase;
    private final SearchAttachmentTypesUseCase searchAttachmentTypesUseCase;
    private final AttachmentTypeMapperView mapperView;

    public AttachmentTypeAdapterView(
            CreateAttachmentTypeUseCase createAttachmentTypeUseCase,
            UpdateAttachmentTypeUseCase updateAttachmentTypeUseCase,
            FindAttachmentTypeByIdUseCase findAttachmentTypeByIdUseCase,
            DeleteAttachmentTypeByIdUseCase deleteAttachmentTypeByIdUseCase,
            SearchAttachmentTypesUseCase searchAttachmentTypesUseCase,
            AttachmentTypeMapperView mapperView) {
        this.createAttachmentTypeUseCase = createAttachmentTypeUseCase;
        this.updateAttachmentTypeUseCase = updateAttachmentTypeUseCase;
        this.findAttachmentTypeByIdUseCase = findAttachmentTypeByIdUseCase;
        this.deleteAttachmentTypeByIdUseCase = deleteAttachmentTypeByIdUseCase;
        this.searchAttachmentTypesUseCase = searchAttachmentTypesUseCase;
        this.mapperView = mapperView;
    }

    public AttachmentTypeResponseView createAttachmentType(AttachmentTypeApiRequestView requestView) {
        return mapperView.toResponseView(createAttachmentTypeUseCase.createAttachmentType(mapperView.toDomain(requestView)));
    }

    public AttachmentTypeResponseView updateAttachmentType(UUID attachmentTypeId, AttachmentTypeApiRequestView requestView) {
        return mapperView.toResponseView(updateAttachmentTypeUseCase.updateAttachmentType(attachmentTypeId, mapperView.toDomain(requestView)));
    }

    public AttachmentTypeResponseView findAttachmentTypeById(UUID attachmentTypeId) {
        return mapperView.toResponseView(findAttachmentTypeByIdUseCase.findAttachmentTypeById(attachmentTypeId));
    }

    public void deleteAttachmentTypeById(UUID attachmentTypeId) {
        deleteAttachmentTypeByIdUseCase.deleteAttachmentTypeById(attachmentTypeId);
    }

    public AttachmentTypePageResponseView searchAttachmentTypes(String nameFilter, Integer page, Integer size, String sortField, String sortDirection) {
        // Defaults and normalization to avoid NPEs and IllegalArgumentException
        long safePage = page == null ? 0L : page.longValue();
        long safeSize = size == null ? 20L : size.longValue();
        String safeSort = (sortField == null || sortField.isBlank()) ? "name" : sortField;
        Direction safeDirection;
        if (sortDirection == null) {
            safeDirection = Direction.ASC;
        } else {
            try {
                safeDirection = Direction.valueOf(sortDirection.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                safeDirection = Direction.ASC;
            }
        }
        return mapperView.toResponsePageView(searchAttachmentTypesUseCase.searchAttachmentTypes(
                nameFilter, new CommonSearch(safePage, safeSize, safeSort, safeDirection)));
    }

}
