package fr.xenonbyte.optifact.backend.application.common.attachment;

import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.CreateAttachmentUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.out.AttachmentRepository;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out.AttachmentTypeRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;

import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateAttachmentApplicationService implements CreateAttachmentUseCase {

    private static final Logger LOGGER = Logger.getLogger(CreateAttachmentApplicationService.class.getName());

    private final AttachmentRepository repository;
    private final AttachmentTypeRepository attachmentTypeRepository;

    public CreateAttachmentApplicationService(AttachmentRepository repository, AttachmentTypeRepository attachmentTypeRepository) {
        this.repository = repository;
        this.attachmentTypeRepository = attachmentTypeRepository;
    }

    @Override
    public Attachment createAttachment(Attachment attachment) {
        LOGGER.info("Creating attachment...");

        if(!attachmentTypeRepository.existById(attachment.getAttachmentTypeId())) {
            throw new AttachmentTypeIdNotFoundException(attachment.getAttachmentTypeId());
        }

        attachment = repository.save(attachment);

        LOGGER.info("Attachment created successfully with id: '" + attachment.getId() + "'");
        return attachment;
    }
}
