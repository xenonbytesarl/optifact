package fr.xenonbyte.optifact.backend.domain.common.setting.vo;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.VALUE_OBJECT)
@Hexagonal.ValueObject
public final class Address {
    private final String street;
    private final String city;
    private final String country;
    private final String zipCode;
    private final String website;

    public Address(String street, String city, String country, String zipCode, String website) {
        this.street = street;
        this.city = city;
        this.country = country;
        this.zipCode = zipCode;
        this.website = website;
    }

    public static Address with(String street, String city, String country, String zipCode, String state) {
        return new Address(street, city, country, zipCode, state);
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

    public String getWebsite() {
        return website;
    }
}
