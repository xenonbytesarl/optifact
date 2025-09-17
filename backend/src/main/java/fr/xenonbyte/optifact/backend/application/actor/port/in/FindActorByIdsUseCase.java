package fr.xenonbyte.optifact.backend.application.actor.port.in;

import fr.xenonbyte.optifact.backend.domain.actor.Actor;

import java.util.List;
import java.util.Set;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
public interface FindActorByIdsUseCase {
    List<Actor> findActorByIds(Set<UUID> actorIds);
}
