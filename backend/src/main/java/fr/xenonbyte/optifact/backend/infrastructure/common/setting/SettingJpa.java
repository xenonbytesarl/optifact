package fr.xenonbyte.optifact.backend.infrastructure.common.setting;

import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import jakarta.persistence.Embedded;
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
 * @since 20/09/2025
 */
@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_setting")
public class SettingJpa extends BaseEntityJpa {

    @Embedded
    private CompanyEmbeddableJpa company;

    @Embedded
    private EmailServerEmbeddableJpa emailServer;
}
