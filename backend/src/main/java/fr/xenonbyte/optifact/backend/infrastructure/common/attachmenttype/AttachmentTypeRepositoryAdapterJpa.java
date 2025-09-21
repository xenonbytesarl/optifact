package fr.xenonbyte.optifact.backend.infrastructure.common.attachmenttype;

import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out.AttachmentTypeRepository;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public class AttachmentTypeRepositoryAdapterJpa implements AttachmentTypeRepository {

    private final AttachmentTypeRepositoryJpa repositoryJpa;
    private final AttachmentTypeMapperJpa mapperJpa;

    public AttachmentTypeRepositoryAdapterJpa(AttachmentTypeRepositoryJpa repositoryJpa, AttachmentTypeMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }

    @Override
    public AttachmentType save(AttachmentType attachmentType) {
        return mapperJpa.toDomain(repositoryJpa.save(mapperJpa.toJpa(attachmentType)));
    }

    @Override
    public Optional<AttachmentType> findById(UUID attachmentTypeId) {
        return repositoryJpa.findById(attachmentTypeId).map(mapperJpa::toDomain);
    }

    @Override
    public Pagination<AttachmentType> search(String nameFilter, CommonSearch search) {
        Specification<AttachmentTypeJpa> spec = (root, query, cb) -> cb.conjunction();

        spec =  addNativeStringFilter(nameFilter, spec);

        Sort sort = Sort.by(search.direction().equals(Direction.ASC) ? Sort.Direction.ASC: Sort.Direction.DESC, "name");

        PageRequest pageRequest = PageRequest.of(search.page().intValue(), search.size().intValue(), sort);

        Page<AttachmentTypeJpa> attachmentTypeJpaPage = repositoryJpa.findAll(spec, pageRequest);
        List<AttachmentType> attachmentTypes = attachmentTypeJpaPage.getContent().stream().map(mapperJpa::toDomain).toList();
        return Pagination.create(
               attachmentTypes,
               attachmentTypeJpaPage.getTotalPages(),
               attachmentTypeJpaPage.getTotalElements(),
               search.page(),
               search.size(),
               !attachmentTypeJpaPage.hasNext(),
               !attachmentTypeJpaPage.hasPrevious()
        );
    }

    private Specification<AttachmentTypeJpa> addNativeStringFilter(String value, Specification<AttachmentTypeJpa> spec) {

        if(value != null && !value.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("name")), "%" + value.toLowerCase() + "%"));
        }
        return spec;
    }

    @Override
    public Boolean existByName(String name) {
        return repositoryJpa.existsByNameEqualsIgnoreCase(name);
    }

    @Override
    public Boolean existByNameExcludingId(String name, UUID attachmentTypeId) {
        return repositoryJpa.existsByNameEqualsIgnoreCaseAndIdNot(name, attachmentTypeId);
    }

    @Override
    public Boolean existById(UUID attachmentTypeId) {
        return repositoryJpa.existsById(attachmentTypeId);
    }

    @Override
    public void delete(AttachmentType attachmentType) {
        repositoryJpa.delete(mapperJpa.toJpa(attachmentType));
    }

    @Override
    public List<AttachmentType> findByIds(Set<UUID> attachmentTypeIds) {
        return repositoryJpa.findByIdIn(attachmentTypeIds.stream().toList()).stream().map(mapperJpa::toDomain).toList();
    }

    @Override
    public Optional<AttachmentType> findByName(String name) {
        return repositoryJpa.findByNameIgnoreCase(name).map(mapperJpa::toDomain);
    }
}
