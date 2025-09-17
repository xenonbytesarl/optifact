package fr.xenonbyte.optifact.backend.application.actor.port.out;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.Repository
@Hexagonal.SecondaryPort
public interface ActorRepository {
    Boolean existsByReference(String reference);

    Boolean existsByName(String name);

    Actor save(Actor actor);

    Optional<Actor> findById(UUID actorId);

    Boolean existsByReferenceExcludingId(String reference, UUID actorId);

    Boolean existsByNameExcludingId(String name, UUID actorId);

    void delete(Actor actor);

    Pagination<Actor> search(String referenceFilter, String nameFilter, CommonSearch search);

    boolean existsById(UUID actorId);

    List<Actor> findByIds(Set<UUID> actorIds);
}
