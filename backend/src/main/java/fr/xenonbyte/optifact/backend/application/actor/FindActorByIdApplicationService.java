package fr.xenonbyte.optifact.backend.application.actor;

import fr.xenonbyte.optifact.backend.application.actor.exception.ActorIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.actor.port.in.FindActorByIdUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;
import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindActorByIdApplicationService implements FindActorByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindActorByIdApplicationService.class.getName());

    private final ActorRepository repository;

    public FindActorByIdApplicationService(ActorRepository repository) {
        this.repository = repository;
    }

    @Override
    public Actor findActorById(UUID actorId) {
        LOGGER.info("Find actor with id: '" + actorId + "'" );

        Actor actor = repository.findById(actorId)
                .orElseThrow(() -> new ActorIdNotFoundException(actorId));

        LOGGER.info("Actor found successfully with id: '" + actorId + "'" );
        return actor;
    }
}
