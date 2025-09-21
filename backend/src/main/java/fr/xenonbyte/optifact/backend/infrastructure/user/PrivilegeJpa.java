package fr.xenonbyte.optifact.backend.infrastructure.user;

import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

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
@Table(name = "t_privilege")
public class PrivilegeJpa extends BaseEntityJpa {

    @Column(name = "c_name", nullable = false, unique = true)
    private String name;
}
