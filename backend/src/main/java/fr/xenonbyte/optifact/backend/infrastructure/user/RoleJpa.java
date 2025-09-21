package fr.xenonbyte.optifact.backend.infrastructure.user;

import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.Set;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_role")
public class RoleJpa extends BaseEntityJpa {

    @Column(name = "c_code", nullable = false, unique = true)
    private String code;

    @Column(name = "c_name", nullable = false)
    private String name;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "t_role_privilege",
            joinColumns = @JoinColumn(name = "c_role_id"),
            inverseJoinColumns = @JoinColumn(name = "c_privilege_id"))
    private Set<PrivilegeJpa> privileges;
}
