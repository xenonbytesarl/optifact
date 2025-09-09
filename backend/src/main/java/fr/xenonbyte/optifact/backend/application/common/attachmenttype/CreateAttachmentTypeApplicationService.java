package fr.xenonbyte.optifact.backend.application.common.attachmenttype;

import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeNameConflictException;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.CreateAttachmentTypeUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out.AttachmentTypeRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;

import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public class CreateAttachmentTypeApplicationService implements CreateAttachmentTypeUseCase {
    private static final Logger LOGGER = Logger.getLogger(CreateAttachmentTypeApplicationService.class.getName());

    private final AttachmentTypeRepository repository;

    public CreateAttachmentTypeApplicationService(AttachmentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public AttachmentType createAttachmentType(AttachmentType attachmentType) {
        LOGGER.info("Creating attachment type...");

        if(Boolean.TRUE.equals(repository.existByName(attachmentType.getName()))) {
            throw new AttachmentTypeNameConflictException(attachmentType.getName());
        }

        attachmentType = repository.save(attachmentType);

        LOGGER.info("Attachment type created successfully with id: '" + attachmentType.getId() + "'");

        return attachmentType;
    }
}
