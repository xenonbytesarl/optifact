package fr.xenonbyte.optifact.backend.application.common.attachmenttype;

import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeNameConflictException;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.UpdateAttachmentTypeUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out.AttachmentTypeRepository;
import fr.xenonbyte.optifact.backend.application.productcategory.UpdateProductCategoryApplicationService;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;

import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public class UpdateAttachmentTypeApplicationService implements UpdateAttachmentTypeUseCase {
    private static final Logger LOGGER = Logger.getLogger(UpdateProductCategoryApplicationService.class.getName());

    private final AttachmentTypeRepository repository;

    public UpdateAttachmentTypeApplicationService(AttachmentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public AttachmentType updateAttachmentType(UUID attachmentTypeId, AttachmentType attachmentType) {
        LOGGER.info("Updating attachment type with id: '" + attachmentTypeId + "'");

        Optional<AttachmentType> optional = repository.findById(attachmentTypeId);

        if(optional.isEmpty()) {
            throw new AttachmentTypeIdNotFoundException(attachmentTypeId);
        }

        if(Boolean.TRUE.equals(repository.existByNameExcludingId(attachmentType.getName(), attachmentTypeId))) {
            throw new AttachmentTypeNameConflictException(attachmentType.getName());
        }

        AttachmentType existing = optional.get();
        existing = existing.update(attachmentType.getName());

        attachmentType = repository.save(existing);

        LOGGER.info("Attachment type updated successfully with id: '" + attachmentType.getId() + "'");

        return attachmentType;
    }
}
