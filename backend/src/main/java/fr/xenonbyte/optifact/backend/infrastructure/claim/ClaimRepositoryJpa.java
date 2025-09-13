package fr.xenonbyte.optifact.backend.infrastructure.claim;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

@Hexagonal.Repository
public interface ClaimRepositoryJpa extends JpaRepository<ClaimJpa, UUID>, JpaSpecificationExecutor<ClaimJpa> {
    Boolean existsByReferenceEqualsIgnoreCase(String reference);
    Boolean existsByReferenceEqualsIgnoreCaseAndIdNot(String reference, UUID claimId);
}
