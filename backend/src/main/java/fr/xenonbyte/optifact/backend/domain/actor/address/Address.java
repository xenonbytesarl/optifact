package fr.xenonbyte.optifact.backend.domain.actor.address;

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
public final class Address extends BaseEntity {
    private final AddressType type;
    private final String street;
    private final String city;
    private final String country;
    private final String zipCode;
    private final String state;
    private final Boolean active;
    private UUID actorId;

    public Address(UUID id, AddressType type, String street, String city, String country,
                   String zipCode, String state, Boolean active) {
        this.id = id;
        this.type = type;
        this.street = street;
        this.city = city;
        this.country = country;
        this.zipCode = zipCode;
        this.state = state;
        this.active = active;
    }

    public Address(UUID id, AddressType type, String street, String city, String country,
                   String zipCode, String state, UUID actorId, Boolean active) {
        this.id = id;
        this.type = type;
        this.street = street;
        this.city = city;
        this.country = country;
        this.zipCode = zipCode;
        this.state = state;
        this.actorId = actorId;
        this.active = active;
    }

    private static Address create(AddressType type, String street, String city, String country,
                                  String zipCode, String state, Boolean active) {
        validateParams(type, street, city, country, zipCode);
        return new Address(randomUUID(), type, street, city, country, zipCode, state, active);
    }

    private static Address create(UUID id, AddressType type, String street, String city, String country,
                                  String zipCode, String state, Boolean active) {
        validateParams(type, street, city, country, zipCode);
        return new Address(id, type, street, city, country, zipCode, state, active);
    }

    public Address update(AddressType type, String street, String city, String country,
                          String zipCode, String state, Boolean active) {
        validateParams(type, street, city, country, zipCode);
        Address address = new Address(id, type, street, city, country, zipCode, state, active);
        address.updateAudit(createdAt);
        return address;
    }

    public Address withActorId(UUID actorId) {
        return new Address(id, type, street, city, country, zipCode, state, actorId, active);
    }

    private static void validateParams(AddressType type, String street, String city, String country,
                                       String zipCode) {
        if (type == null) {
            throw new IllegalArgumentException(AddressMessage.ADDRESS_TYPE_REQUIRED);
        }
        if (city == null || city.isBlank()) {
            throw new IllegalArgumentException(AddressMessage.ADDRESS_CITY_REQUIRED);
        }
        if (country == null || country.isBlank()) {
            throw new IllegalArgumentException(AddressMessage.ADDRESS_COUNTRY_REQUIRED);
        }
    }

    public AddressType getType() {
        return type;
    }

    public String getStreet() {
        return street;
    }

    public String getCity() {
        return city;
    }

    public String getCountry() {
        return country;
    }

    public String getZipCode() {
        return zipCode;
    }

    public String getState() {
        return state;
    }

    public Boolean getActive() {
        return active;
    }

    public UUID getActorId() {
        return actorId;
    }
}
