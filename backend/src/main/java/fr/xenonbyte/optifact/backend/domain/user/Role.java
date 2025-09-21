package fr.xenonbyte.optifact.backend.domain.user;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.user.message.UserMessage;

import java.util.Collections;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

import static java.util.UUID.randomUUID;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Role extends BaseEntity {
    private final String code;
    private final String name;
    private final Set<Privilege> privileges;

    private Role(UUID id, String code, String name, Set<Privilege> privileges) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.privileges = privileges;
    }

    public static Role create(String code, String name, Set<Privilege> privileges) {
        validate(code, name, privileges);
        return new Role(randomUUID(), code.trim(), name.trim(), privileges);
    }

    public static Role create(UUID id, String code, String name, Set<Privilege> privileges) {
        validate(code, name, privileges);
        return new Role(id, code.trim(), name.trim(), privileges);
    }

    private static void validate(String code, String name, Set<Privilege> privileges) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException(UserMessage.ROLE_CODE_REQUIRED);
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(UserMessage.ROLE_NAME_REQUIRED);
        }
        if(privileges == null || privileges.isEmpty()) {
            throw new IllegalArgumentException(UserMessage.ROLE_PRIVILEGES_REQUIRED);
        }
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public Set<Privilege> getPrivileges() {
        return privileges;
    }
}
