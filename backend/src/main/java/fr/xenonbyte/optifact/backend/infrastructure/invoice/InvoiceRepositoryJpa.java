package fr.xenonbyte.optifact.backend.infrastructure.invoice;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

public interface InvoiceRepositoryJpa extends JpaRepository<InvoiceJpa, UUID>, JpaSpecificationExecutor<InvoiceJpa> {

    boolean existsByReferenceEqualsIgnoreCase(String reference);

    boolean existsByReferenceEqualsIgnoreCaseAndIdNot(String reference, UUID id);
}
