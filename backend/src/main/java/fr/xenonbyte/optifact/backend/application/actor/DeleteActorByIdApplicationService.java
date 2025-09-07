package fr.xenonbyte.optifact.backend.application.actor;

import fr.xenonbyte.optifact.backend.application.actor.exception.ActorIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.actor.port.in.DeleteActorByIdUseCase;
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
public final class DeleteActorByIdApplicationService implements DeleteActorByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(DeleteActorByIdApplicationService.class.getName());

    private final ActorRepository repository;

    public DeleteActorByIdApplicationService(ActorRepository repository) {
        this.repository = repository;
    }

    @Override
    public void deleteActorById(UUID actorId) {
        LOGGER.info("deleting actor with id: '" + actorId + "'" );
        Actor actor = repository.findById(actorId)
                .orElseThrow(() -> new ActorIdNotFoundException(actorId));

        repository.delete(actor);
        LOGGER.info("Actor with id: '" + actorId + "' deleted successfully");
    }
}
