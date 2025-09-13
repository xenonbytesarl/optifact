package fr.xenonbyte.optifact.backend.application.common.attachment;

import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.FindAttachmentByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.out.AttachmentRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindAttachmentByIdsApplicationService implements FindAttachmentByIdsUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindAttachmentByIdsApplicationService.class.getName());

    private final AttachmentRepository repository;

    public FindAttachmentByIdsApplicationService(AttachmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Attachment> findAttachmentByIds(Set<UUID> attachmentIds) {
        LOGGER.info("Find attachments for ids: '" + attachmentIds + "'");
        List<Attachment> attachments = repository.findByIds(attachmentIds);
        LOGGER.info("Attachments found successfully for ids: '" + attachmentIds + "'");
        return attachments;
    }
}
