package fr.xenonbyte.optifact.backend.application.actor.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.actor.ActorMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
public final class ActorIdNotFoundException extends NotFoundException {
    public ActorIdNotFoundException(UUID actorId) {
        super(ActorMessage.ACTOR_ID_NOT_FOUND, actorId);
    }
}
