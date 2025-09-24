package fr.xenonbyte.optifact.backend.api.actor;

import fr.xenonbyte.optifact.backend.api.actor.generated.view.ActorPageResponseView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.ActorResponseView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.CreateActorApiRequestView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.UpdateActorApiRequestView;
import fr.xenonbyte.optifact.backend.application.actor.port.in.CreateActorUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.in.DeleteActorByIdUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.in.FindActorByIdUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.in.SearchActorsUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.in.UpdateActorUseCase;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public final class ActorAdapterView {

    private final CreateActorUseCase createActorUseCase;
    private final UpdateActorUseCase updateActorUseCase;
    private final DeleteActorByIdUseCase deleteActorByIdUseCase;
    private final FindActorByIdUseCase findActorByIdUseCase;
    private final SearchActorsUseCase searchActorsUseCase;
    private final ActorMapperView mapperView;

    public ActorAdapterView(CreateActorUseCase createActorUseCase, UpdateActorUseCase updateActorUseCase,
                    DeleteActorByIdUseCase deleteActorByIdUseCase, FindActorByIdUseCase findActorByIdUseCase, SearchActorsUseCase searchActorsUseCase, ActorMapperView mapperView) {
        this.createActorUseCase = createActorUseCase;
        this.updateActorUseCase = updateActorUseCase;
        this.deleteActorByIdUseCase = deleteActorByIdUseCase;
        this.findActorByIdUseCase = findActorByIdUseCase;
        this.searchActorsUseCase = searchActorsUseCase;
        this.mapperView = mapperView;
    }

    public ActorResponseView createActor(CreateActorApiRequestView requestView) {
        return mapperView.toActorResponseView(createActorUseCase.createActor(mapperView.toActor(requestView)));
    }

    public ActorResponseView updateActor(UUID actorId, UpdateActorApiRequestView requestView) {
        return mapperView.toActorResponseView(updateActorUseCase.updateActor(actorId, mapperView.toActor(requestView)));
    }

    public ActorResponseView findActorById(UUID actorId) {
        return mapperView.toActorResponseView(findActorByIdUseCase.findActorById(actorId));
    }

    public void deleteActorById(UUID actorId) {
        deleteActorByIdUseCase.deleteActorById(actorId);
    }

    public ActorPageResponseView searchActors(String referenceFilter, String nameFilter, String registrationNumberFilter, String taxNumberFilter,  Integer page, Integer size, String sortField, String sortDirection) {
        // Defaults and normalization to avoid NPEs and IllegalArgumentException
        long safePage = page == null ? 0L : page.longValue();
        long safeSize = size == null ? 20L : size.longValue();
        String safeSort = (sortField == null || sortField.isBlank()) ? "name" : sortField;
        Direction safeDirection;
        if (sortDirection == null) {
            safeDirection = Direction.ASC;
        } else {
            try {
                safeDirection = Direction.valueOf(sortDirection.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                safeDirection = Direction.ASC;
            }
        }
        return mapperView.toActorPageResponseView(searchActorsUseCase.searchActors(
                referenceFilter,
                nameFilter,
                registrationNumberFilter,
                taxNumberFilter,
                new CommonSearch(safePage, safeSize, safeSort, safeDirection))
        );
    }
}
