package fr.xenonbyte.optifact.backend.domain.common.setting.vo;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.VALUE_OBJECT)
@Hexagonal.ValueObject
public final class Contact{
    private final String name;
    private final String email;
    private final String phone;
    private final String function;

    public Contact(String name, String email, String phone, String function) {
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.function = function;
    }

    public static Contact with(String name, String email, String phone, String function) {
        return new Contact( name, email, phone, function);
    }

    public Contact update(String name, String email, String phone, String function) {
        return new Contact(name, email, phone, function);
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

}
