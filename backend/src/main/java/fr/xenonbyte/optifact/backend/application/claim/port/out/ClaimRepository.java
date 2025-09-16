package fr.xenonbyte.optifact.backend.application.claim.port.out;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.Repository
@Hexagonal.SecondaryPort
public interface ClaimRepository {
    Boolean existsByReference(String reference);

    Claim save(Claim claim);

    Optional<Claim> findById(UUID claimId);

    Boolean existsByReferenceExcludingId(String reference, UUID claimId);

    void delete(Claim claim);

    Pagination<Claim> search(String referenceFilter, String actorName, String productName, CommonSearch search);

    boolean existsById(UUID claimId);
}
