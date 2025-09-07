package fr.xenonbyte.optifact.backend.infrastructure.actor.contact;

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
@Table(name = "t_contact")
public class ContactJpa extends BaseEntityJpa {

    @Enumerated(EnumType.STRING)
    @Column(name = "c_type", nullable = false)
    private ContactTypeJpa type;

    @Column(name = "c_name", nullable = false)
    private String name;

    @Column(name = "c_email")
    private String email;

    @Column(name = "c_phone")
    private String phone;

    @Column(name = "c_function")
    private String function;

    @Column(name = "c_active", nullable = false)
    private Boolean active;

    @ManyToOne
    @JoinColumn(name = "c_actor_id", nullable = false)
    private ActorJpa actor;

}
