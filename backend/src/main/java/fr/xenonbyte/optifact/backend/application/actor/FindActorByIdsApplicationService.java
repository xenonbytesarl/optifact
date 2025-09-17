package fr.xenonbyte.optifact.backend.application.actor;

import fr.xenonbyte.optifact.backend.application.actor.port.in.FindActorByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindActorByIdsApplicationService implements FindActorByIdsUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindActorByIdsApplicationService.class.getName());

    private final ActorRepository repository;

    public FindActorByIdsApplicationService(ActorRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<Actor> findActorByIds(Set<UUID> actorIds) {
        LOGGER.info("Find actor with ids: '" + actorIds + "'" );

        List<Actor> actors = repository.findByIds(actorIds);

        LOGGER.info("Actor founds successfully with id: '" + actorIds + "'" );
        return actors;
    }
}
