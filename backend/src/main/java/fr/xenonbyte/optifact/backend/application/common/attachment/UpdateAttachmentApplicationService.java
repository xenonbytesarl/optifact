package fr.xenonbyte.optifact.backend.application.common.attachment;

import fr.xenonbyte.optifact.backend.application.common.attachment.exception.AttachmentIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.UpdateAttachmentUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.out.AttachmentRepository;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out.AttachmentTypeRepository;
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
public final class UpdateAttachmentApplicationService implements UpdateAttachmentUseCase {

    private static final Logger LOGGER = Logger.getLogger(UpdateAttachmentApplicationService.class.getName());

    private final AttachmentRepository repository;
    private final AttachmentTypeRepository attachmentTypeRepository;

    public UpdateAttachmentApplicationService(AttachmentRepository repository, AttachmentTypeRepository attachmentTypeRepository) {
        this.repository = repository;
        this.attachmentTypeRepository = attachmentTypeRepository;
    }

    @Override
    public Attachment updateAttachment(UUID attachmentId, Attachment attachment) {
        LOGGER.info("Updating attachment with id: '" + attachmentId + "'");


        Attachment existing = repository.findById(attachmentId)
                .orElseThrow(() -> new AttachmentIdNotFoundException(attachmentId));

        if(!attachmentTypeRepository.existById(attachment.getAttachmentTypeId())) {
            throw new AttachmentTypeIdNotFoundException(attachment.getAttachmentTypeId());
        }

        // Build updated aggregate using domain update to preserve audit
        Attachment updated = existing.update(
                attachment.getFilename(),
                attachment.getMimeType(),
                attachment.getAttachmentTypeId(),
                attachment.getType(),
                attachment.getResourceId(),
                attachment.getResourceName()
        );

        updated = repository.save(updated);
        LOGGER.info("Attachment updated successfully with id: '" + updated.getId() + "'");
        return updated;
    }
}
