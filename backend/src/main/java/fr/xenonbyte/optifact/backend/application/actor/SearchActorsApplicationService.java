package fr.xenonbyte.optifact.backend.application.actor;

import fr.xenonbyte.optifact.backend.application.actor.port.in.SearchActorsUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SearchActorsApplicationService implements SearchActorsUseCase {

    private static final Logger LOGGER = Logger.getLogger(SearchActorsApplicationService.class.getName());

    private final ActorRepository repository;

    public SearchActorsApplicationService(ActorRepository repository) {
        this.repository = repository;
    }
    
    @Override
    public Pagination<Actor> searchActors(String referenceFilter, String nameFilter, CommonSearch search) {
        LOGGER.info("Searching actors with nameFilter: '" + nameFilter + "', referenceFilter: '" + referenceFilter + "'" );

        Pagination<Actor> actorsPage = repository.search(referenceFilter, nameFilter, search);

        LOGGER.info("Found " + actorsPage.elements().size() + " actors (total: " + actorsPage.totalElements() + ")");
        return actorsPage;
        
    }
}
