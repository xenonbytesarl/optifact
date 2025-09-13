package fr.xenonbyte.optifact.backend.infrastructure.common.attachment;

import fr.xenonbyte.optifact.backend.application.common.attachment.port.out.AttachmentRepository;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public final class AttachmentRepositoryAdapterJpa implements AttachmentRepository {

    private final AttachmentRepositoryJpa repositoryJpa;
    private final AttachmentMapperJpa mapperJpa;

    public AttachmentRepositoryAdapterJpa(AttachmentRepositoryJpa repositoryJpa, AttachmentMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }

    @Override
    public Attachment save(Attachment attachment) {
        return mapperJpa.toDomain(repositoryJpa.save(mapperJpa.toJpa(attachment)));
    }

    @Override
    public Optional<Attachment> findById(UUID attachmentId) {
        return repositoryJpa.findById(attachmentId).map(mapperJpa::toDomain);
    }

    @Override
    public void delete(Attachment attachment) {
        repositoryJpa.delete(mapperJpa.toJpa(attachment));
    }

    @Override
    public Pagination<Attachment> search(String filenameFilter, String attachmentTypeName, CommonSearch search) {
        Specification<AttachmentJpa> spec = (root, query, cb) -> cb.conjunction();

        // filename like filter
        if (filenameFilter != null && !filenameFilter.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("filename")), "%" + filenameFilter.toLowerCase() + "%"));
        }
        // join to attachment type and filter by its name
        if (attachmentTypeName != null && !attachmentTypeName.isBlank()) {
            spec = spec.and((root, query, cb) -> {
                var typeJoin = root.join("attachmentType");
                return cb.like(cb.lower(typeJoin.get("name")), "%" + attachmentTypeName.toLowerCase() + "%");
            });
        }

        Sort sort = parseSort(search.sort(), search.direction());
        PageRequest pageRequest = PageRequest.of(search.page().intValue(), search.size().intValue(), sort);
        Page<AttachmentJpa> page = repositoryJpa.findAll(spec, pageRequest);
        List<Attachment> content = page.getContent().stream().map(mapperJpa::toDomain).toList();

        return Pagination.create(
                content,
                page.getTotalPages(),
                page.getTotalElements(),
                search.page(),
                search.size(),
                !page.hasNext(),
                !page.hasPrevious()
        );
    }

    private Sort parseSort(String field, Direction direction) {
        if (field == null || field.isBlank() || direction == null) {
            return Sort.by(Sort.Direction.ASC, "id");
        }
        Sort.Direction sortDir = "DESC".equalsIgnoreCase(direction.name()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String fieldName = switch (field) {
            case "filename", "mimeType", "resourceName", "createdAt", "updatedAt" -> field;
            default -> "id";
        };
        return Sort.by(sortDir, fieldName);
    }

    @Override
    public boolean existsByIdsAndFilenameNotNull(List<UUID> attachmentsIds) {
        return attachmentsIds != null && !attachmentsIds.isEmpty() && repositoryJpa.existsByIdInAndFilenameNotNull(attachmentsIds);
    }

    @Override
    public List<Attachment> saveAll(List<Attachment> attachments) {
        return repositoryJpa.saveAll(attachments.stream().map(mapperJpa::toJpa).toList()).stream()
                .map(mapperJpa::toDomain)
                .toList();
    }

    @Override
    public List<Attachment> findByIds(Set<UUID> ids) {
        return repositoryJpa.findAllById(ids).stream().map(mapperJpa::toDomain).toList();
    }
}
