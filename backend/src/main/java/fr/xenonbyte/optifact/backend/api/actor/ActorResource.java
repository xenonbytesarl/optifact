package fr.xenonbyte.optifact.backend.api.actor;

import fr.xenonbyte.optifact.backend.api.actor.generated.view.CreateActorApiRequestView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.UpdateActorApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.api.actor.generated.ActorsApi;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.ActorApiRequestView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.ActorApiResponseView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.ActorPageApiResponseView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.ApiSuccessResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.Locale;
import java.util.UUID;

import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.CONTENT;
import static java.util.Map.of;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@RestController
public class ActorResource implements ActorsApi {

    private final ActorAdapterView adapterView;

    public ActorResource(ActorAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<ActorApiResponseView> createActor(String acceptLanguage, CreateActorApiRequestView actorApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new ActorApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(CREATED.name())
                        .message(MessageUtil.getMessage(ActorMessageView.ACTOR_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.createActor(actorApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<ApiSuccessResponse> deleteActor(String acceptLanguage, UUID actorId) {
        adapterView.deleteActorById(actorId);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ActorMessageView.ACTOR_DELETED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
        );
    }

    @Override
    public ResponseEntity<ActorApiResponseView> findActorById(String acceptLanguage, UUID actorId) {
        return ResponseEntity.status(OK).body(
                new ActorApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ActorMessageView.ACTOR_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findActorById(actorId)))
        );
    }

    @Override
    public ResponseEntity<ActorPageApiResponseView> searchActors(String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String nameFilter, String referenceFilter, String taxNumberFilter, String registrationNumberFilter) {
        return ResponseEntity.status(OK).body(
                new ActorPageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ActorMessageView.ACTORS_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchActors(referenceFilter, nameFilter, registrationNumberFilter, taxNumberFilter, page, size, sortField, sortDirection)))
        );
    }

    @Override
    public ResponseEntity<ActorApiResponseView> updateActor(String acceptLanguage, UUID actorId, UpdateActorApiRequestView actorApiRequestView) {
        return ResponseEntity.status(OK).body(
                new ActorApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ActorMessageView.ACTOR_UPDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.updateActor(actorId, actorApiRequestView)))
        );
    }
}
