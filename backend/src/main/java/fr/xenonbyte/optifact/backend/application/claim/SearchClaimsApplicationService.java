package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.port.in.SearchClaimsUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SearchClaimsApplicationService implements SearchClaimsUseCase {

    private static final Logger LOGGER = Logger.getLogger(SearchClaimsApplicationService.class.getName());

    private final ClaimRepository repository;

    public SearchClaimsApplicationService(ClaimRepository repository) {
        this.repository = repository;
    }

    @Override
    public Pagination<Claim> searchClaims(String referenceFilter, String stateFilter, String actorName, String productName, CommonSearch search) {
        LOGGER.info("Searching claims...");
        Pagination<Claim> result = repository.search(referenceFilter, stateFilter, actorName, productName, search);
        LOGGER.info("Claims search completed. Page: " + result.page() + ", size: " + result.size());
        return result;
    }
}
