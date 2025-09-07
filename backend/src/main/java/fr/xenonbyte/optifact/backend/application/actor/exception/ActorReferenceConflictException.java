package fr.xenonbyte.optifact.backend.application.actor.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.domain.actor.ActorMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
public final class ActorReferenceConflictException extends ConflictException {
    public ActorReferenceConflictException(String reference) {
        super(ActorMessage.ACTOR_REFERENCE_CONFLICT, reference);
    }
}
