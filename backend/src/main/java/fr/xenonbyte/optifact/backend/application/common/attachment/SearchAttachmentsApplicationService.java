package fr.xenonbyte.optifact.backend.application.common.attachment;

import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.SearchAttachmentsUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.out.AttachmentRepository;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
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
public final class SearchAttachmentsApplicationService implements SearchAttachmentsUseCase {

    private static final Logger LOGGER = Logger.getLogger(SearchAttachmentsApplicationService.class.getName());

    private final AttachmentRepository repository;

    public SearchAttachmentsApplicationService(AttachmentRepository repository) {
        this.repository = repository;
    }

    @Override
    public Pagination<Attachment> searchAttachments(String filenameFilter, String attachmentTypeName, CommonSearch search) {
        LOGGER.info("Searching attachments...");
        Pagination<Attachment> result = repository.search(filenameFilter, attachmentTypeName, search);
        LOGGER.info("Attachments search completed. Page: " + result.page() + ", size: " + result.size());
        return result;
    }
}
