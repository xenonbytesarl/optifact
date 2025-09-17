package fr.xenonbyte.optifact.backend.infrastructure.invoice;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceState;
import fr.xenonbyte.optifact.backend.infrastructure.claim.ClaimJpa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public final class InvoiceRepositoryAdapterJpa implements InvoiceRepository {

    private final InvoiceRepositoryJpa repositoryJpa;
    private final InvoiceMapperJpa mapperJpa;

    public InvoiceRepositoryAdapterJpa(InvoiceRepositoryJpa repositoryJpa, InvoiceMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }

    @Override
    public Invoice save(Invoice invoice) {
        return mapperJpa.toDomain(repositoryJpa.save(mapperJpa.toJpa(invoice)));
    }

    @Override
    public Optional<Invoice> findById(UUID invoiceId) {
        return repositoryJpa.findById(invoiceId).map(mapperJpa::toDomain);
    }

    @Override
    public void delete(Invoice invoice) {
        repositoryJpa.delete(mapperJpa.toJpa(invoice));
    }

    @Override
    public Pagination<Invoice> search(String referenceFilter, String actorName, String claimName, String stateFilter, CommonSearch search) {
        Specification<InvoiceJpa> spec = (root, query, cb) -> cb.conjunction();

        if (referenceFilter != null && !referenceFilter.isBlank()) {
            spec = spec.and((root, q, cb2) -> cb2.like(cb2.lower(root.get("reference")), "%" + referenceFilter.toLowerCase() + "%"));
        }
        if (actorName != null && !actorName.isBlank()) {
            spec = spec.and((root, q, cb2) -> {
                var join = root.join("actor");
                return cb2.like(cb2.lower(join.get("name")), "%" + actorName.toLowerCase() + "%");
            });
        }
        if (claimName != null && !claimName.isBlank()) {
            spec = spec.and((root, q, cb2) -> {
                var join = root.join("claim");
                return cb2.like(cb2.lower(join.get("name")), "%" + claimName.toLowerCase() + "%");
            });
        }
        if (stateFilter != null && !stateFilter.isBlank()) {
            spec = spec.and((root, q, cb2) -> cb2.like(cb2.lower(root.get("state")), "%" + stateFilter.toLowerCase() + "%"));
        }

        Sort sort = parseSort(search.sort(), search.direction());
        PageRequest pageRequest = PageRequest.of(search.page().intValue(), search.size().intValue(), sort);

        Page<InvoiceJpa> page = repositoryJpa.findAll(spec, pageRequest);
        List<Invoice> content = page.getContent().stream().map(mapperJpa::toDomain).toList();

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
    public boolean existsByClaimId(UUID claimId) {
        ClaimJpa claimJpa = ClaimJpa.builder().id(claimId).build();
        return repositoryJpa.existsByClaim(claimJpa);
    }

    @Override
    public List<Invoice> findByClaimId(UUID claimId) {
        return repositoryJpa.findByClaim(ClaimJpa.builder().id(claimId).build()).stream()
                .map(mapperJpa::toDomain)
                .toList();
    }

    private Sort parseSort(String field, Direction direction) {
        if (field == null || field.isBlank() || direction == null) {
            return Sort.by(Sort.Direction.ASC, "id");
        }
        Sort.Direction sortDir = "DESC".equalsIgnoreCase(direction.name()) ? Sort.Direction.DESC : Sort.Direction.ASC;
        String fieldName = switch (field) {
            case "reference", "createdAt", "updatedAt", "sendAt", "dueAt", "amount", "state" -> field;
            default -> "id";
        };
        return Sort.by(sortDir, fieldName);
    }
}
