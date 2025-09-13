package fr.xenonbyte.optifact.backend.application.common.attachment.port.out;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.Repository
@Hexagonal.SecondaryPort
public interface AttachmentRepository {
    Attachment save(Attachment attachment);

    Optional<Attachment> findById(UUID attachmentId);

    void delete(Attachment attachment);

    Pagination<Attachment> search(String filenameFilter, String attachmentTypeName, CommonSearch search);

    boolean existsByIdsAndFilenameNotNull(List<UUID> attachmentsIds);

    List<Attachment> saveAll(List<Attachment> attachments);
}
