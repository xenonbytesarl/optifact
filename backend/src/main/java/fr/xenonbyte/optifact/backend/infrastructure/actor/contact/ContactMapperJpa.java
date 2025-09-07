package fr.xenonbyte.optifact.backend.infrastructure.actor.contact;

import fr.xenonbyte.optifact.backend.domain.actor.contact.Contact;
import fr.xenonbyte.optifact.backend.domain.actor.contact.ContactType;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Mapper
public interface ContactMapperJpa {
    ContactJpa toJpa(Contact contact);
    Contact toDomain(ContactJpa contactJpa);

    @ObjectFactory
    default Contact createContact(ContactJpa contactJpa) {
        return Contact.create(
                contactJpa.getId(),
                ContactType.valueOf(contactJpa.getType().name()),
                contactJpa.getName(),
                contactJpa.getEmail(),
                contactJpa.getPhone(),
                contactJpa.getFunction(),
                contactJpa.getActor().getId(),
                contactJpa.getActive()
        );
    }
}
