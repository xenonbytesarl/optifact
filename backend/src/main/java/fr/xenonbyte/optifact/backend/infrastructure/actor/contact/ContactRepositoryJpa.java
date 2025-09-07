package fr.xenonbyte.optifact.backend.infrastructure.actor.contact;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal.Repository
public interface ContactRepositoryJpa extends JpaRepository<ContactJpa, UUID> {
}
