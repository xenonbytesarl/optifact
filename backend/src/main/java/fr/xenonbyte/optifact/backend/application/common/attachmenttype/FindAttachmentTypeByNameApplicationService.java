package fr.xenonbyte.optifact.backend.application.common.attachmenttype;

import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeNameNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.FindAttachmentTypeByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.FindAttachmentTypeByNameUseCase;
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
public class FindAttachmentTypeByNameApplicationService implements FindAttachmentTypeByNameUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindAttachmentTypeByNameApplicationService.class.getName());

    private final AttachmentTypeRepository repository;

    public FindAttachmentTypeByNameApplicationService(AttachmentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public AttachmentType findAttachmentTypeByName(String name) {
        LOGGER.info("Find attachment type with name: '" + name + "'" );

        AttachmentType attachmentType = repository.findByName(name)
                .orElseThrow(() -> new AttachmentTypeNameNotFoundException(name));

        LOGGER.info("Attachment found successfully with id: '" + name + "'" );
        return attachmentType;
    }
}
