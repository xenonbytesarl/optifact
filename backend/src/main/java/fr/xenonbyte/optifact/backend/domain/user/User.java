package fr.xenonbyte.optifact.backend.domain.user;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.user.message.UserMessage;

import java.time.ZonedDateTime;
import java.util.Collections;
import java.util.HashSet;
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
public final class User extends BaseEntity {

    public static final String DEFAULT_ACTOR_ROLE = "ACTOR";

    private final String firstname;
    private final String lastname; // required
    private final String email; // required
    private final String password; // required
    private final String phone;

    private final Boolean accountEnabled;
    private final Boolean accountLocked;
    private final Boolean accountExpired;
    private final Boolean credentialExpired;
    private final Boolean mfaEnabled;

    private final Integer totalLoginAttempt;

    private final UUID actorId;

    private final Set<Role> roles;

    private User(UUID id,
                 String firstname,
                 String lastname,
                 String email,
                 String password,
                 String phone,
                 Boolean accountEnabled,
                 Boolean accountLocked,
                 Boolean accountExpired,
                 Boolean credentialExpired,
                 Boolean mfaEnabled,
                 Integer totalLoginAttempt,
                 UUID actorId,
                 Set<Role> roles) {
        this.id = id;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.phone = phone;
        this.accountEnabled = accountEnabled;
        this.accountLocked = accountLocked;
        this.accountExpired = accountExpired;
        this.credentialExpired = credentialExpired;
        this.mfaEnabled = mfaEnabled;
        this.totalLoginAttempt = totalLoginAttempt;
        this.actorId = actorId;
        this.roles = Collections.unmodifiableSet(roles == null ? Set.of() : new HashSet<>(roles));
    }

    public static User create(String firstname,
                              String lastname,
                              String email,
                              String phone,
                              UUID actorId,
                              Set<Role> roles) {
        validateRequired(lastname, email, roles);
        return new User(
                randomUUID(),
                firstname,
                lastname,
                email,
                null,
                phone,
                false,
                false,
                false,
                false,
                true,
                0,
                actorId,
                roles
        );
    }

    public static User create(UUID id,
                              String firstname,
                              String lastname,
                              String email,
                              String phone,
                              Boolean accountEnabled,
                              Boolean accountLocked,
                              Boolean accountExpired,
                              Boolean credentialExpired,
                              Boolean mfaEnabled,
                              Integer totalLoginAttempt,
                              UUID actorId,
                              Set<Role> roles) {
        validateRequired(lastname, email, roles);
        return new User(
                id,
                firstname,
                lastname,
                email,
                null,
                phone,
                accountEnabled,
                accountLocked,
                accountExpired,
                credentialExpired,
                mfaEnabled,
                totalLoginAttempt,
                actorId,
                roles
        );
    }

    public static void checkPassword(String password, String confirmPassword) {
        if(password == null || password.isBlank()) {
            throw new IllegalArgumentException(UserMessage.USER_PASSWORD_REQUIRED);
        }

        if(confirmPassword == null || confirmPassword.isBlank()) {
            throw new IllegalArgumentException(UserMessage.USER_PASSWORD_REQUIRED);
        }

        if (!password.equals(confirmPassword)) {
            throw new IllegalArgumentException(UserMessage.USER_PASSWORD_AND_CONFIRM_NOT_MATCH);
        }


    }

    public User update(String firstname,
                       String lastname,
                       String email,
                       String phone,
                       UUID actorId,
                       Set<Role> roles) {
        validateRequired(lastname, email, roles);
        User user = new User(
                this.id,
                firstname,
                lastname,
                email,
                this.password,
                phone,
                this.accountEnabled,
                this.accountLocked,
                this.accountExpired,
                this.credentialExpired,
                this.mfaEnabled,
                this.totalLoginAttempt,
                actorId,
                roles
        );
        user.updateAudit(this.createdAt);
        return user;
    }

    public User withEnabledAccount(boolean enabled) {
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                this.password,
                this.phone,
                enabled,
                this.accountLocked,
                this.accountExpired,
                this.credentialExpired,
                this.mfaEnabled,
                this.totalLoginAttempt,
                this.actorId,
                this.roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    public User withUnlockAccount() {
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                this.password,
                this.phone,
                this.accountEnabled,
                false,
                this.accountExpired,
                this.credentialExpired,
                this.mfaEnabled,
                0,
                this.actorId,
                this.roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    public User withLockAccount() {
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                this.password,
                this.phone,
                this.accountEnabled,
                true,
                this.accountExpired,
                this.credentialExpired,
                this.mfaEnabled,
                this.totalLoginAttempt,
                this.actorId,
                this.roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    public User withAccountExpired(boolean expired) {
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                this.password,
                this.phone,
                this.accountEnabled,
                this.accountLocked,
                expired,
                this.credentialExpired,
                this.mfaEnabled,
                this.totalLoginAttempt,
                this.actorId,
                this.roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    public User withCredentialsExpired(boolean expired) {
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                this.password,
                this.phone,
                this.accountEnabled,
                this.accountLocked,
                this.accountExpired,
                expired,
                this.mfaEnabled,
                this.totalLoginAttempt,
                this.actorId,
                this.roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    public User withMfaEnabled(boolean enabled) {
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                this.password,
                this.phone,
                this.accountEnabled,
                this.accountLocked,
                this.accountExpired,
                this.credentialExpired,
                enabled,
                this.totalLoginAttempt,
                this.actorId,
                this.roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    public User withPassword(String newPassword) {
        if(password == null || password.isBlank()) {
            throw new IllegalArgumentException(UserMessage.USER_PASSWORD_REQUIRED);
        }
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                newPassword,
                this.phone,
                this.accountEnabled,
                this.accountLocked,
                this.accountExpired,
                this.credentialExpired,
                this.mfaEnabled,
                this.totalLoginAttempt,
                this.actorId,
                this.roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    public User withTotalLoginAttempt(int count) {
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                this.password,
                this.phone,
                this.accountEnabled,
                this.accountLocked,
                this.accountExpired,
                this.credentialExpired,
                this.mfaEnabled,
                count,
                this.actorId,
                this.roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    public User withRoles(Set<Role> roles) {
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                this.password,
                this.phone,
                this.accountEnabled,
                this.accountLocked,
                this.accountExpired,
                this.credentialExpired,
                this.mfaEnabled,
                this.totalLoginAttempt,
                this.actorId,
                roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    public User withActorId(UUID actorId) {
        User u = new User(
                this.id,
                this.firstname,
                this.lastname,
                this.email,
                this.password,
                this.phone,
                this.accountEnabled,
                this.accountLocked,
                this.accountExpired,
                this.credentialExpired,
                this.mfaEnabled,
                this.totalLoginAttempt,
                actorId,
                roles);
        u.updateAudit(this.createdAt);
        return u;
    }

    private static void validateRequired(String lastname, String email, Set<Role> roles) {
        if (lastname == null || lastname.isBlank()) {
            throw new IllegalArgumentException(UserMessage.USER_LASTNAME_REQUIRED);
        }
        if (email == null || email.isBlank()) {
            throw new IllegalArgumentException(UserMessage.USER_EMAIL_REQUIRED);
        }

        if(roles == null || roles.isEmpty()) {
            throw new IllegalArgumentException(UserMessage.USER_ROLE_REQUIRED);
        }
    }

    public String getFirstname() {
        return firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getPhone() {
        return phone;
    }

    public Boolean getAccountEnabled() {
        return accountEnabled;
    }

    public Boolean getAccountLocked() {
        return accountLocked;
    }

    public Boolean getAccountExpired() {
        return accountExpired;
    }

    public Boolean getCredentialExpired() {
        return credentialExpired;
    }

    public Boolean getMfaEnabled() {
        return mfaEnabled;
    }

    public Integer getTotalLoginAttempt() {
        return totalLoginAttempt;
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public UUID getActorId() {
        return actorId;
    }
}
