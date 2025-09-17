package fr.xenonbyte.optifact.backend.application.invoice.port.out;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceState;

import java.util.Optional;
import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.Repository
@Hexagonal.SecondaryPort
public interface InvoiceRepository {
    Invoice save(Invoice invoice);

    Optional<Invoice> findById(UUID invoiceId);

    void delete(Invoice invoice);

    Pagination<Invoice> search(String referenceFilter, String actorName, String claimName, String stateFilter, CommonSearch search);

    boolean existsByClaimId(UUID claimId);
}
