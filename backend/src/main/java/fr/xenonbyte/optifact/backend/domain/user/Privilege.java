package fr.xenonbyte.optifact.backend.domain.user;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.user.message.UserMessage;

import static java.util.UUID.randomUUID;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Privilege extends BaseEntity {
    private final String name;

    private Privilege(java.util.UUID id, String name) {
        this.id = id;
        this.name = name;
    }

    public static Privilege create(String name) {
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(UserMessage.PRIVILEGE_NAME_REQUIRED);
        }
        return new Privilege(randomUUID(), name.trim());
    }

    public String getName() {
        return name;
    }
}
