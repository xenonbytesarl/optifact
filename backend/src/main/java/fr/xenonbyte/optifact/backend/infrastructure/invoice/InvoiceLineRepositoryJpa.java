package fr.xenonbyte.optifact.backend.infrastructure.invoice;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface InvoiceLineRepositoryJpa extends JpaRepository<InvoiceLineJpa, UUID> {
}
