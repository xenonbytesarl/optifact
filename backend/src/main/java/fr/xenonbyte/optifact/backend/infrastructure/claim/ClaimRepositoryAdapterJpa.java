package fr.xenonbyte.optifact.backend.infrastructure.claim;

import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
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
public final class ClaimRepositoryAdapterJpa implements ClaimRepository {

    private final ClaimRepositoryJpa repositoryJpa;
    private final ClaimMapperJpa mapperJpa;

    public ClaimRepositoryAdapterJpa(ClaimRepositoryJpa repositoryJpa, ClaimMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }

    @Override
    public Boolean existsByReference(String reference) {
        return repositoryJpa.existsByReferenceEqualsIgnoreCase(reference);
    }

    @Override
    public Claim save(Claim claim) {
        return mapperJpa.toDomain(repositoryJpa.save(mapperJpa.toJpa(claim)));
    }

    @Override
    public Optional<Claim> findById(UUID claimId) {
        return repositoryJpa.findById(claimId).map(mapperJpa::toDomain);
    }

    @Override
    public Boolean existsByReferenceExcludingId(String reference, UUID claimId) {
        return repositoryJpa.existsByReferenceEqualsIgnoreCaseAndIdNot(reference, claimId);
    }

    @Override
    public void delete(Claim claim) {
        repositoryJpa.delete(mapperJpa.toJpa(claim));
    }

    @Override
    public Pagination<Claim> search(String referenceFilter, String actorName, String productName, CommonSearch search) {
        Specification<ClaimJpa> spec = (root, query, cb) -> cb.conjunction();

        // reference like
        if (referenceFilter != null && !referenceFilter.isBlank()) {
            spec = spec.and((root, q, cb2) -> cb2.like(cb2.lower(root.get("reference")), "%" + referenceFilter.toLowerCase() + "%"));
        }
        // actor name like (join)
        if (actorName != null && !actorName.isBlank()) {
            spec = spec.and((root, q, cb2) -> {
                var join = root.join("actor");
                return cb2.like(cb2.lower(join.get("name")), "%" + actorName.toLowerCase() + "%");
            });
        }
        // product name like (join)
        if (productName != null && !productName.isBlank()) {
            spec = spec.and((root, q, cb2) -> {
                var join = root.join("product");
                return cb2.like(cb2.lower(join.get("name")), "%" + productName.toLowerCase() + "%");
            });
        }

        Sort sort = parseSort(search.sort(), search.direction());
        PageRequest pageRequest = PageRequest.of(search.page().intValue(), search.size().intValue(), sort);

        Page<ClaimJpa> page = repositoryJpa.findAll(spec, pageRequest);
        List<Claim> content = page.getContent().stream().map(mapperJpa::toDomain).toList();

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

    @Override
    public boolean existsById(UUID claimId) {
        return repositoryJpa.existsById(claimId);
    }

    @Override
    public List<Claim> findByIds(Set<UUID> claimIds) {
        return repositoryJpa.findAllById(claimIds).stream().map(mapperJpa::toDomain).toList();
    }

    private Sort parseSort(String field, Direction direction) {
        if (field == null || field.isBlank() || direction == null) {
            return Sort.by(Sort.Direction.ASC, "id");
        }
        Sort.Direction sortDir = "DESC".equalsIgnoreCase(direction.name()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String fieldName = switch (field) {
            case "reference", "createdAt", "updatedAt" -> field;
            default -> "id";
        };
        return Sort.by(sortDir, fieldName);
    }
}
