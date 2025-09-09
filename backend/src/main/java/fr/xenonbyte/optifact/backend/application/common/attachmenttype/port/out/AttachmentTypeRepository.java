package fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.Repository
@Hexagonal.SecondaryPort
public interface AttachmentTypeRepository {
    AttachmentType save(AttachmentType attachmentType);

    Optional<AttachmentType> findById(UUID categoryId);

    Pagination<AttachmentType> search(String nameFilter, CommonSearch search);

    Boolean existByName(String name);

    Boolean existByNameExcludingId(String name, UUID categoryId);

    Boolean existById(UUID categoryId);

    void delete(AttachmentType attachmentType);

    List<AttachmentType> findByIds(Set<UUID> categoryIds);
}
