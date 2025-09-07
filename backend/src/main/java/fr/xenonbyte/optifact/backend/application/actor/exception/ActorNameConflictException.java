package fr.xenonbyte.optifact.backend.application.actor.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.domain.actor.ActorMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
public final class ActorNameConflictException extends ConflictException {
    public ActorNameConflictException(String name) {
        super(ActorMessage.ACTOR_NAME_CONFLICT, name);
    }
}
