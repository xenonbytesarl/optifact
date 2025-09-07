package fr.xenonbyte.optifact.backend.domain.actor.contact;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;

import java.util.UUID;

import static java.util.UUID.randomUUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Contact extends BaseEntity {
    private final ContactType type;
    private final String name;
    private final String email;
    private final String phone;
    private final String function;
    private final Boolean active;
    private UUID actorId;

    public Contact(UUID id, ContactType type, String name, String email, String phone, String function, Boolean active) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.function = function;
        this.active = active;
    }

    public Contact(UUID id, ContactType type, String name, String email, String phone, String function, UUID actorId, Boolean active) {
        this.id = id;
        this.type = type;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.function = function;
        this.actorId = actorId;
        this.active = active;
    }

    public static Contact create(ContactType type, String name, String email, String phone,
                                  String function, Boolean active) {
        validateParams(type, name, email);

        return new Contact(randomUUID(), type, name, email, phone, function, active);
    }

    public static Contact create(UUID id, ContactType type, String name, String email, String phone,
                                  String function, UUID actorId, Boolean active) {
        validateParams(type, name, email);

        return new Contact(id, type, name, email, phone, function, actorId, active);
    }

    public Contact update(ContactType type, String name, String email, String phone,
                          String function, Boolean active) {
        validateParams(type, name, email);
        Contact contact = new Contact(id, type, name, email, phone, function, active);
        contact.updateAudit(createdAt);
        return contact;
    }

    public Contact withActorId(UUID actorId) {
        return new Contact(id, type, name, email, phone, function, actorId, active);
    }

    private static void validateParams(ContactType type, String name, String email) {
        if(type == null) {
            throw new IllegalArgumentException(ContactMessage.CONTACT_TYPE_REQUIRED);
        }

        if(name == null || name.isBlank()) {
            throw new IllegalArgumentException(ContactMessage.CONTACT_NAME_REQUIRED);
        }

        if(email == null || email.isBlank()) {
            throw new IllegalArgumentException(ContactMessage.CONTACT_EMAIL_REQUIRED);
        }
    }

    public ContactType getType() {
        return type;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhone() {
        return phone;
    }

    public String getFunction() {
        return function;
    }

    public UUID getActorId() {
        return actorId;
    }

    public Boolean getActive() {
        return active;
    }
}
