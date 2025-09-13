package fr.xenonbyte.optifact.backend.application.common.attachment;

import fr.xenonbyte.optifact.backend.application.common.attachment.exception.AttachmentIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.FindAttachmentByIdUseCase;
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
public final class FindAttachmentByIdApplicationService implements FindAttachmentByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindAttachmentByIdApplicationService.class.getName());

    private final AttachmentRepository repository;

    public FindAttachmentByIdApplicationService(AttachmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Attachment findAttachmentById(UUID attachmentId) {
        LOGGER.info("Find attachment with id: '" + attachmentId + "'");
        Attachment attachment = repository.findById(attachmentId)
                .orElseThrow(() -> new AttachmentIdNotFoundException(attachmentId));
        LOGGER.info("Attachment found successfully with id: '" + attachmentId + "'");
        return attachment;
    }
}
