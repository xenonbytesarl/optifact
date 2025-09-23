package fr.xenonbyte.optifact.backend.application.actor;

import fr.xenonbyte.optifact.backend.application.actor.exception.ActorIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.actor.exception.ActorNameConflictException;
import fr.xenonbyte.optifact.backend.application.actor.exception.ActorReferenceConflictException;
import fr.xenonbyte.optifact.backend.application.actor.port.in.CreateActorUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.in.UpdateActorUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class UpdateActorApplicationService implements UpdateActorUseCase {

    private static final Logger LOGGER = Logger.getLogger(UpdateActorApplicationService.class.getName());

    private final ActorRepository repository;

    public UpdateActorApplicationService(ActorRepository repository) {
        this.repository = repository;
    }

    @Override
    public Actor updateActor(UUID actorId, Actor actor) {
        LOGGER.info("Updating actor...");

        Optional<Actor> optionalActor = repository.findById(actorId);

        if(optionalActor.isEmpty()) {
            throw new ActorIdNotFoundException(actorId);
        }

        if(actor.getReference() != null && !actor.getReference().isBlank() && Boolean.TRUE.equals(repository.existsByReferenceExcludingId(actor.getReference(), actorId))) {
            throw new ActorReferenceConflictException(actor.getReference());
        }

        if(Boolean.TRUE.equals(repository.existsByNameExcludingId(actor.getName(), actorId))) {
            throw new ActorNameConflictException(actor.getName());
        }

        Actor existing = optionalActor.get();

        existing = existing.update(actor.getName(), actor.getRegistrationNumber(), actor.getTaxNumber(), actor.getReference(), actor.getAddresses(), actor.getContacts());

        actor = repository.save(existing);

        LOGGER.info("Actor created successfully with id: '" + actor.getId() + "'");

        return actor;
    }
}
