package fr.xenonbyte.optifact.backend.infrastructure.common.attachmenttype;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal.Repository
public interface AttachmentTypeRepositoryJpa extends JpaRepository<AttachmentTypeJpa, UUID>, JpaSpecificationExecutor<AttachmentTypeJpa> {
    Boolean existsByNameEqualsIgnoreCase(String name);

    Boolean existsByNameEqualsIgnoreCaseAndIdNot(String name, UUID categoryId);

    List<AttachmentTypeJpa> findByIdIn(List<UUID> ids);

    Optional<AttachmentTypeJpa> findByNameIgnoreCase(String name);
}
