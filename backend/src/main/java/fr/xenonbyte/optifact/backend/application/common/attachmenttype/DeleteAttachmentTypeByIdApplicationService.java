package fr.xenonbyte.optifact.backend.application.common.attachmenttype;

import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.DeleteAttachmentTypeByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out.AttachmentTypeRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public class DeleteAttachmentTypeByIdApplicationService implements DeleteAttachmentTypeByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(DeleteAttachmentTypeByIdApplicationService.class.getName());

    private final AttachmentTypeRepository repository;

    public DeleteAttachmentTypeByIdApplicationService(AttachmentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public void deleteAttachmentTypeById(UUID categoryId) {
        LOGGER.info("Deleting attachment type with id: '" + categoryId + "'" );
        AttachmentType productCategory = repository.findById(categoryId)
                .orElseThrow(() -> new AttachmentTypeIdNotFoundException(categoryId));

        repository.delete(productCategory);
        LOGGER.info("Attachment type with id: '" + categoryId + "' deleted successfully");
    }
}
