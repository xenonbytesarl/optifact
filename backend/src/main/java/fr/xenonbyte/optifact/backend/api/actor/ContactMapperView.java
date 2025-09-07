package fr.xenonbyte.optifact.backend.api.actor;

import fr.xenonbyte.optifact.backend.api.actor.generated.view.ContactRequestView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.ContactResponseView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.ContactTypeView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.CreateContactRequestView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.UpdateContactRequestView;
import fr.xenonbyte.optifact.backend.domain.actor.contact.Contact;
import fr.xenonbyte.optifact.backend.domain.actor.contact.ContactType;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

import java.util.UUID;

import static java.util.UUID.randomUUID;

/**
 * Dedicated mapper for Contact API <-> Domain mappings.
 */
@Mapper
public interface ContactMapperView {

    // API -> Domain
    Contact toDomain(CreateContactRequestView view);
    Contact toDomain(UpdateContactRequestView view);

    // Domain -> API
    default ContactResponseView toResponse(Contact contact) {
        return mapToResponse(contact);
    }

    @ObjectFactory
    default Contact createContact(CreateContactRequestView view) {
        ContactType type = view.getType() == null ? null : ContactType.valueOf(view.getType().getValue());
        return Contact.create(
                type,
                view.getName(),
                view.getEmail(),
                view.getPhone(),
                view.getFunction(),
                view.getActive()
        );
    }

    @ObjectFactory
    default Contact createContact(UpdateContactRequestView view) {
        ContactType type = view.getType() == null ? null : ContactType.valueOf(view.getType().getValue());
        return Contact.create(
                view.getId() == null? randomUUID() : view.getId(),
                type,
                view.getName(),
                view.getEmail(),
                view.getPhone(),
                view.getFunction(),
                null,
                view.getActive()
        );
    }

    default ContactResponseView mapToResponse(Contact contact) {
        ContactResponseView resp = new ContactResponseView()
                .type(contact.getType() == null ? null : ContactTypeView.fromValue(contact.getType().name()))
                .name(contact.getName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .function(contact.getFunction())
                .active(contact.getActive())
                .id(contact.getId());
        UUID actorId = contact.getActorId();
        if (actorId != null) {
            resp.actorId(actorId);
        }
        return resp;
    }

    default ContactResponseView toResponseInternal(Contact contact) { return mapToResponse(contact); }
}
