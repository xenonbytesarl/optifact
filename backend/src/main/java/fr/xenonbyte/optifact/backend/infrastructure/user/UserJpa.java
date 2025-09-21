package fr.xenonbyte.optifact.backend.infrastructure.user;

import fr.xenonbyte.optifact.backend.infrastructure.actor.ActorJpa;
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
@Table(name = "t_user")
public class UserJpa extends BaseEntityJpa {

    @Column(name = "c_firstname")
    private String firstname;

    @Column(name = "c_lastname", nullable = false)
    private String lastname;

    @Column(name = "c_email", nullable = false, unique = true)
    private String email;

    @Column(name = "c_password")
    private String password;

    @Column(name = "c_phone")
    private String phone;

    @Column(name = "c_account_enabled", nullable = false)
    private Boolean accountEnabled;

    @Column(name = "c_account_locked", nullable = false)
    private Boolean accountLocked;

    @Column(name = "c_account_expired", nullable = false)
    private Boolean accountExpired;

    @Column(name = "c_credential_expired", nullable = false)
    private Boolean credentialExpired;

    @Column(name = "c_mfa_enabled", nullable = false)
    private Boolean mfaEnabled;

    @Column(name = "c_total_login_attempt", nullable = false)
    private Integer totalLoginAttempt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "c_actor_id")
    private ActorJpa actor;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "t_user_role",
            joinColumns = @JoinColumn(name = "c_user_id"),
            inverseJoinColumns = @JoinColumn(name = "c_role_id"))
    private Set<RoleJpa> roles;
}
