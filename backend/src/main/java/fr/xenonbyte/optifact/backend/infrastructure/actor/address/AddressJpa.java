package fr.xenonbyte.optifact.backend.infrastructure.actor.address;

import fr.xenonbyte.optifact.backend.infrastructure.actor.ActorJpa;
import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_address")
public class AddressJpa extends BaseEntityJpa {

    @Enumerated(EnumType.STRING)
    @Column(name = "c_type", nullable = false)
    private AddressTypeJpa type;
    @Column(name = "c_street")
    private String street;
    @Column(name = "c_city", nullable = false)
    private String city;
    @Column(name = "c_country", nullable = false)
    private String country;
    @Column(name = "c_state")
    private String state;
    @Column(name = "c_zip_code")
    private String zipCode;
    @Column(name = "c_active", nullable = false)
    private Boolean active;
    @ManyToOne
    @JoinColumn(name = "c_actor_id", nullable = false)
    private ActorJpa actor;
}
