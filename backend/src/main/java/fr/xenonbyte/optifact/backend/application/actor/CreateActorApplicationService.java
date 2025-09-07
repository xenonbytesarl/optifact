package fr.xenonbyte.optifact.backend.application.actor;

import fr.xenonbyte.optifact.backend.application.actor.exception.ActorNameConflictException;
import fr.xenonbyte.optifact.backend.application.actor.exception.ActorReferenceConflictException;
import fr.xenonbyte.optifact.backend.application.actor.port.in.CreateActorUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateActorApplicationService implements CreateActorUseCase {

    private static final Logger LOGGER = Logger.getLogger(CreateActorApplicationService.class.getName());

    private final ActorRepository repository;

    public CreateActorApplicationService(ActorRepository repository) {
        this.repository = repository;
    }

    @Override
    public Actor createActor(Actor actor) {
        LOGGER.info("Creating actor...");

        if(actor.getReference() != null && !actor.getReference().isBlank() && Boolean.TRUE.equals(repository.existsByReference(actor.getReference()))) {
            throw new ActorReferenceConflictException(actor.getReference());
        }

        if(Boolean.TRUE.equals(repository.existsByName(actor.getName()))) {
            throw new ActorNameConflictException(actor.getName());
        }

        actor = repository.save(actor);

        LOGGER.info("Actor created successfully with id: '" + actor.getId() + "'");

        return actor;
    }
}
