package fr.xenonbyte.optifact.backend.infrastructure.common.attachment;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.UUID;

@Hexagonal.Repository
public interface AttachmentRepositoryJpa extends JpaRepository<AttachmentJpa, UUID>, JpaSpecificationExecutor<AttachmentJpa> {
    boolean existsByIdInAndFilenameNotNull(List<UUID> ids);
}
