package fr.xenonbyte.optifact.backend.infrastructure.common.sequence;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 10/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public final class SequenceRepositoryAdapterJpa implements SequenceRepository {

    private final SequenceRepositoryJpa repositoryJpa;
    private final SequenceMapperJpa mapperJpa;

    public SequenceRepositoryAdapterJpa(SequenceRepositoryJpa repositoryJpa, SequenceMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }

    @Override
    public Sequence save(Sequence sequence) {
        return mapperJpa.toDomain(repositoryJpa.save(mapperJpa.toJpa(sequence)));
    }

    @Override
    public boolean existsByCode(String code) {
        return repositoryJpa.existsByCodeEqualsIgnoreCase(code);
    }

    @Override
    public boolean existsByName(String name) {
        return repositoryJpa.existsByNameEqualsIgnoreCase(name);
    }

    @Override
    public boolean existsByCodeExcludingId(String code, UUID id) {
        return repositoryJpa.existsByCodeEqualsIgnoreCaseAndIdNot(code, id);
    }

    @Override
    public boolean existsByNameExcludingId(String name, UUID id) {
        return repositoryJpa.existsByNameEqualsIgnoreCaseAndIdNot(name, id);
    }

    @Override
    public Optional<Sequence> findById(UUID sequenceId) {
        return repositoryJpa.findById(sequenceId).map(mapperJpa::toDomain);
    }

    @Override
    public Optional<Sequence> findByCode(String code) {
        return repositoryJpa.findByCodeEqualsIgnoreCase(code).map(mapperJpa::toDomain);
    }

    @Override
    public Optional<Sequence> findByName(String name) {
        return repositoryJpa.findByNameEqualsIgnoreCase(name).map(mapperJpa::toDomain);
    }

    @Override
    public Pagination<Sequence> search(String nameFilter, String codeFilter, String prefixFilter, String suffixFilter, CommonSearch commonSearch) {
        Specification<SequenceJpa> spec = (root, query, cb) -> cb.conjunction();

        spec = addStringFilter(codeFilter, spec, "code");
        spec = addStringFilter(nameFilter, spec, "name");
        spec = addStringFilter(prefixFilter, spec, "prefix");
        spec = addStringFilter(suffixFilter, spec, "suffix");

        String sort = commonSearch.sort();
        Long page = commonSearch.page();
        Long size = commonSearch.size();
        String direction = commonSearch.direction().name();

        Sort springSort = parseSort(sort, direction);
        PageRequest pageRequest = PageRequest.of(page.intValue(), size.intValue(), springSort);

        Page<SequenceJpa> sequenceJpaPage = repositoryJpa.findAll(spec, pageRequest);
        List<Sequence> sequences = sequenceJpaPage.getContent().stream()
                .map(mapperJpa::toDomain)
                .toList();

        return Pagination.create(
                sequences,
                sequenceJpaPage.getTotalPages(),
                sequenceJpaPage.getTotalElements(),
                page,
                size,
                !sequenceJpaPage.hasNext(),
                !sequenceJpaPage.hasPrevious()
        );
    }

    @Override
    public void delete(Sequence sequence) {
        repositoryJpa.delete(mapperJpa.toJpa(sequence));
    }

    @Override
    public boolean existById(UUID sequenceId) {
        return repositoryJpa.existsById(sequenceId);
    }

    private static Specification<SequenceJpa> addStringFilter(String filter, Specification<SequenceJpa> spec, String field) {
        if (filter != null && !filter.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get(field)), "%" + filter.toLowerCase() + "%"));
        }
        return spec;
    }

    private Sort parseSort(String sortField, String sortDirection) {
        if (sortField == null || sortField.isEmpty()) {
            return Sort.by(Sort.Direction.ASC, "id");
        }
        Sort.Direction direction = "desc".equalsIgnoreCase(sortDirection) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String fieldName = switch (sortField) {
            case "code", "name", "prefix", "suffix", "active" -> sortField;
            case "step" -> "step";
            case "size" -> "size";
            case "next" -> "next";
            case "createdAt" -> "createdAt";
            case "updatedAt" -> "updatedAt";
            default -> "id";
        };
        return Sort.by(direction, fieldName);
    }
}
