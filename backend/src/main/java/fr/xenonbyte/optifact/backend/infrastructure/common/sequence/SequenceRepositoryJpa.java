package fr.xenonbyte.optifact.backend.infrastructure.common.sequence;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

@Hexagonal.Repository
public interface SequenceRepositoryJpa extends JpaRepository<SequenceJpa, UUID>, JpaSpecificationExecutor<SequenceJpa> {

    boolean existsByCodeEqualsIgnoreCase(String code);

    boolean existsByNameEqualsIgnoreCase(String name);

    boolean existsByCodeEqualsIgnoreCaseAndIdNot(String code, UUID id);

    boolean existsByNameEqualsIgnoreCaseAndIdNot(String name, UUID id);

    Optional<SequenceJpa> findByCodeEqualsIgnoreCase(String code);

    Optional<SequenceJpa> findByNameEqualsIgnoreCase(String name);
}
