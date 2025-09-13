package fr.xenonbyte.optifact.backend.application.common.attachment;

import fr.xenonbyte.optifact.backend.application.common.attachment.exception.AttachmentIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.DeleteAttachmentByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.out.AttachmentRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class DeleteAttachmentByIdApplicationService implements DeleteAttachmentByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(DeleteAttachmentByIdApplicationService.class.getName());

    private final AttachmentRepository repository;

    public DeleteAttachmentByIdApplicationService(AttachmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public void deleteAttachmentById(UUID attachmentId) {
        LOGGER.info("Deleting attachment with id: '" + attachmentId + "'");
        Attachment existing = repository.findById(attachmentId)
                .orElseThrow(() -> new AttachmentIdNotFoundException(attachmentId));
        repository.delete(existing);
        LOGGER.info("Attachment deleted successfully with id: '" + attachmentId + "'");
    }
}
