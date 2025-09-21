package fr.xenonbyte.optifact.backend.infrastructure.user;

import fr.xenonbyte.optifact.backend.domain.user.Privilege;
import fr.xenonbyte.optifact.backend.domain.user.Role;
import fr.xenonbyte.optifact.backend.domain.user.User;
import fr.xenonbyte.optifact.backend.infrastructure.actor.ActorJpa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface UserMapperJpa {

    @Mapping(target = "actor", expression = "java(user.getActorId() == null ? null : fr.xenonbyte.optifact.backend.infrastructure.actor.ActorJpa.builder().id(user.getActorId()).build())")
    @Mapping(target = "roles", expression = "java(toJpaRoles(user.getRoles()))")
    UserJpa toJpa(User user);

    default User toDomain(UserJpa jpa) {
        return createUser(jpa);
    }

    default Set<RoleJpa> toJpaRoles(Set<Role> roles) {
        if (roles == null) return java.util.Collections.emptySet();
        Set<RoleJpa> set = new java.util.HashSet<>();
        for (Role r : roles) {
            RoleJpa rj = RoleJpa.builder()
                    .id(r.getId())
                    .code(r.getCode())
                    .name(r.getName())
                    .build();
            set.add(rj);
        }
        return set;
    }

    default Set<Role> toDomainRoles(Set<RoleJpa> roles) {
        if (roles == null) return java.util.Collections.emptySet();
        Set<Role> set = new java.util.HashSet<>();
        for (RoleJpa r : roles) {
            set.add(toDomain(r));
        }
        return set;
    }

    default Role toDomain(RoleJpa jpa) {
        Set<Privilege> privileges = new HashSet<>();
        if (jpa.getPrivileges() != null) {
            for (PrivilegeJpa p : jpa.getPrivileges()) {
                privileges.add(Privilege.create(p.getName()));
            }
        }
        return Role.create(jpa.getId(), jpa.getCode(), jpa.getName(), privileges);
    }

    default RoleJpa toJpa(Role role) {
        RoleJpa jpa = RoleJpa.builder()
                .id(role.getId())
                .code(role.getCode())
                .name(role.getName())
                .build();
        return jpa;
    }

    @ObjectFactory
    default User createUser(UserJpa jpa) {
        return User.create(
                jpa.getId(),
                jpa.getFirstname(),
                jpa.getLastname(),
                jpa.getEmail(),
                jpa.getPassword(),
                jpa.getPhone(),
                jpa.getAccountEnabled(),
                jpa.getAccountLocked(),
                jpa.getAccountExpired(),
                jpa.getCredentialExpired(),
                jpa.getMfaEnabled(),
                jpa.getTotalLoginAttempt(),
                jpa.getActor() == null ? null : jpa.getActor().getId(),
                toDomainRoles(jpa.getRoles())
        );
    }
}
