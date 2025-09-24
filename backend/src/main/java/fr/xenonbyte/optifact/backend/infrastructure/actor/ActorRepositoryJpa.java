package fr.xenonbyte.optifact.backend.infrastructure.actor;

import aj.org.objectweb.asm.commons.Remapper;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal.Repository
public interface ActorRepositoryJpa extends JpaRepository<ActorJpa, UUID>, JpaSpecificationExecutor<ActorJpa> {
    Boolean existsByReference(String reference);

    Boolean existsByNameIgnoreCase(String name);

    Boolean existsByReferenceAndIdNot(String reference, UUID actorId);

    Boolean existsByNameIgnoreCaseAndIdNot(String name, UUID actorId);

    Optional<ActorJpa> findByReference(String actorReference);

    Optional<ActorJpa> findByTaxNumber(String taxNumber);
    Optional<ActorJpa> findByRegistrationNumber(String registrationNumber);
}
