package fr.xenonbyte.optifact.backend.infrastructure.actor;

import fr.xenonbyte.optifact.backend.infrastructure.actor.address.AddressJpa;
import fr.xenonbyte.optifact.backend.infrastructure.actor.contact.ContactJpa;
import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;

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
@Table(name = "t_actor")
public class ActorJpa extends BaseEntityJpa {
    @Column(name = "c_reference", unique = true)
    private String reference;
    @Column(name = "c_tax_number", unique = true)
    private String taxNumber;
    @Column(name = "c_registration_number", unique = true)
    private String registrationNumber;
    @Column(name = "c_name", nullable = false, unique = true)
    private String name;
    @Column(name = "c_active", nullable = false)
    private Boolean active;
    @OneToMany(mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AddressJpa> addresses;
    @OneToMany(mappedBy = "actor", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ContactJpa> contacts;
}
