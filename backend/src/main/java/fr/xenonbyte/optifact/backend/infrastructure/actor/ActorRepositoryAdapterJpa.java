package fr.xenonbyte.optifact.backend.infrastructure.actor;

import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;
import fr.xenonbyte.optifact.backend.infrastructure.product.ProductJpa;
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
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public final class ActorRepositoryAdapterJpa implements ActorRepository {

    private final ActorRepositoryJpa repositoryJpa;
    private final ActorMapperJpa mapperJpa;

    public ActorRepositoryAdapterJpa(ActorRepositoryJpa repositoryJpa, ActorMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }

    @Override
    public Boolean existsByReference(String reference) {
        return repositoryJpa.existsByReference(reference);
    }

    @Override
    public Boolean existsByName(String name) {
        return repositoryJpa.existsByNameIgnoreCase(name);
    }

    @Override
    public Actor save(Actor actor) {
        return mapperJpa.toDomain(repositoryJpa.save(mapperJpa.toJpa(actor)));
    }

    @Override
    public Optional<Actor> findById(UUID actorId) {
        return repositoryJpa.findById(actorId).map(mapperJpa::toDomain);
    }

    @Override
    public Boolean existsByReferenceExcludingId(String reference, UUID actorId) {
        return repositoryJpa.existsByReferenceAndIdNot(reference, actorId);
    }

    @Override
    public Boolean existsByNameExcludingId(String name, UUID actorId) {
        return repositoryJpa.existsByNameIgnoreCaseAndIdNot(name, actorId);
    }

    @Override
    public void delete(Actor actor) {
        repositoryJpa.delete(mapperJpa.toJpa(actor));
    }

    @Override
    public Pagination<Actor> search(String referenceFilter, String nameFilter, CommonSearch search) {
        Specification<ActorJpa> spec = (root, query, cb) -> cb.conjunction();

        spec =  addNativeStringFilter(nameFilter, "name", spec);
        spec =  addNativeStringFilter(referenceFilter, "reference", spec);

        Sort sort = parseSort(search.sort(), search.direction());

        PageRequest pageRequest = PageRequest.of(search.page().intValue(), search.size().intValue(), sort);

        Page<ActorJpa> actorJpaPage = repositoryJpa.findAll(spec, pageRequest);
        List<Actor> actorCategories = actorJpaPage.getContent().stream().map(mapperJpa::toDomain).toList();
        return Pagination.create(
                actorCategories,
                actorJpaPage.getTotalPages(),
                actorJpaPage.getTotalElements(),
                search.page(),
                search.size(),
                !actorJpaPage.hasNext(),
                !actorJpaPage.hasPrevious()
        );
    }

    @Override
    public boolean existsById(UUID actorId) {
        return repositoryJpa.existsById(actorId);
    }

    private Sort parseSort(String field, Direction direction) {
        if (field == null || field.isBlank() || direction == null) {
            // The default sort is by ID ascending
            return Sort.by(Sort.Direction.ASC, "id");
        }

        Sort.Direction sort = "DESC".equalsIgnoreCase(direction.name())
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        // Map the property name to the corresponding field name in the JPA entity
        String fieldName = switch (field) {
            case "name", "reference" -> field;
            default -> "id";
        };

        return Sort.by(sort, fieldName);
    }

    private Specification<ActorJpa> addNativeStringFilter(String value, String field, Specification<ActorJpa> spec) {

        if(value != null && !value.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get(field)), "%" + value.toLowerCase() + "%"));
        }
        return spec;
    }
}
