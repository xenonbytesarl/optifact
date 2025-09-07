package fr.xenonbyte.optifact.backend.api.actor;

import fr.xenonbyte.optifact.backend.api.actor.generated.view.*;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.actor.address.Address;
import fr.xenonbyte.optifact.backend.domain.actor.address.AddressType;
import fr.xenonbyte.optifact.backend.domain.actor.contact.Contact;
import fr.xenonbyte.optifact.backend.domain.actor.contact.ContactType;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;
import org.mapstruct.factory.Mappers;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Mapper(uses = { AddressMapperView.class, ContactMapperView.class })
public interface ActorMapperView {

    AddressMapperView ADDRESS_MAPPER = Mappers.getMapper(AddressMapperView.class);
    ContactMapperView CONTACT_MAPPER = Mappers.getMapper(ContactMapperView.class);

    // API -> Domain
    Actor toActor(ActorApiRequestView requestView);

    // Domain -> API
    default ActorResponseView toActorResponseView(Actor actor) {
        ActorResponseView resp = new ActorResponseView()
                .id(actor.getId())
                .name(actor.getName())
                .reference(actor.getReference())
                .active(actor.getActive());
        if (actor.getAddresses() != null) {
            resp.setAddresses(actor.getAddresses().stream().map(ADDRESS_MAPPER::toResponse).collect(Collectors.toList()));
        }
        if (actor.getContacts() != null) {
            resp.setContacts(actor.getContacts().stream().map(CONTACT_MAPPER::toResponse).collect(Collectors.toList()));
        }
        return resp;
    }

    default ActorPageResponseView toActorPageResponseView(Pagination<Actor> page) {
        List<ActorResponseView> elements = page.elements() == null ? List.of() : page.elements().stream()
                .map(this::toActorResponseView)
                .collect(Collectors.toList());
        return new ActorPageResponseView(
                page.totalElements(),
                page.totalPages(),
                page.page(),
                page.size(),
                page.first(),
                page.last(),
                elements
        );
    }

    // Factory to create domain from the request view with nested mapping
    @ObjectFactory
    default Actor createActor(ActorApiRequestView requestView) {
        List<Address> addresses = requestView.getAddresses() == null ? null : requestView.getAddresses().stream()
                .filter(Objects::nonNull)
                .map(ADDRESS_MAPPER::createAddress)
                .collect(Collectors.toList());
        List<Contact> contacts = requestView.getContacts() == null ? null : requestView.getContacts().stream()
                .filter(Objects::nonNull)
                .map(CONTACT_MAPPER::createContact)
                .collect(Collectors.toList());
        return Actor.create(
                requestView.getName(),
                requestView.getReference(),
                addresses,
                contacts,
                requestView.getActive()
        );
    }

}
