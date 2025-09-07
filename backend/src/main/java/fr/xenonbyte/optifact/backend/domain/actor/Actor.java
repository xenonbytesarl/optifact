package fr.xenonbyte.optifact.backend.domain.actor;

import fr.xenonbyte.optifact.backend.domain.actor.address.Address;
import fr.xenonbyte.optifact.backend.domain.actor.contact.Contact;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import static java.util.UUID.randomUUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Actor extends BaseEntity {
    private final String name;
    private final String reference;
    private final List<Address> addresses;
    private final List<Contact> contacts;
    private final Boolean active;

    public Actor(UUID id, String name, String reference, List<Address> addresses, List<Contact> contacts, Boolean active) {
        this.id = id;
        this.name = name;
        this.reference = reference;
        this.addresses = addresses;
        this.contacts = contacts;
        this.active = active;
    }


    public static Actor create(String name, String reference, List<Address> addresses, List<Contact> contacts, Boolean active) {
        if(name == null || name.isBlank()) {
            throw new IllegalArgumentException(ActorMessage.ACTOR_NAME_REQUIRED);
        }

        UUID id = randomUUID();

        addresses = normalizeAddresses(addresses, id);

        contacts = normalizeContacts(id, contacts);

        return new Actor(id, name, reference, addresses, contacts, active);
    }

    private static List<Address> normalizeAddresses(List<Address> addresses, UUID id) {
        if(addresses != null && !addresses.isEmpty()) {
            addresses = addresses.stream().map(address -> address.withActorId(id)).toList();
        }
        return addresses;
    }

    public static Actor create(UUID id, String name, String reference, List<Address> addresses, List<Contact> contacts, Boolean active) {
        if(name == null || name.isBlank()) {
            throw new IllegalArgumentException(ActorMessage.ACTOR_NAME_REQUIRED);
        }

        addresses = normalizeAddresses(addresses, id);

        contacts = normalizeContacts(id, contacts);

        return new Actor(id, name, reference, addresses, contacts, active);
    }

    private static List<Contact> normalizeContacts(UUID id, List<Contact> contacts) {
        if(contacts != null && !contacts.isEmpty()) {
            contacts = contacts.stream().map(contact -> contact.withActorId(id)).toList();
        }
        return contacts;
    }

    public Actor update(String name, String reference, List<Address> addresses, List<Contact> contacts, Boolean active) {
        if(name == null || name.isBlank()) {
            throw new IllegalArgumentException(ActorMessage.ACTOR_NAME_REQUIRED);
        }
        addresses = normalizeAddresses(addresses, id);
        contacts = normalizeContacts(id, contacts);
        Actor actor = new Actor(id, name, reference, addresses, contacts, active);
        actor.updateAudit(createdAt);
        return actor;
    }



    public String getName() {
        return name;
    }

    public String getReference() {
        return reference;
    }

    public List<Address> getAddresses() {
        return addresses;
    }

    public List<Contact> getContacts() {
        return contacts;
    }

    public Boolean getActive() {
        return active;
    }
}
