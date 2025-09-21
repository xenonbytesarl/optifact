package fr.xenonbyte.optifact.backend.infrastructure.security;

import fr.xenonbyte.optifact.backend.domain.user.Privilege;
import fr.xenonbyte.optifact.backend.domain.user.User;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@RequiredArgsConstructor
public final class CustomUserDetails implements UserDetails {

    private final User user;

    public User getUser() {
        return user;
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return user.getRoles().stream().map(role -> {
            Set<GrantedAuthority> privileges = role.getPrivileges().stream()
                    .map(Privilege::getName)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toSet());
            privileges.add(new SimpleGrantedAuthority("ROLE_" + role.getCode()));
            return privileges;
        }).flatMap(Collection::stream).toList();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return !user.getAccountExpired();
    }

    @Override
    public boolean isAccountNonLocked() {
        return !user.getAccountLocked();
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return !user.getCredentialExpired();
    }

    @Override
    public boolean isEnabled() {
        return user.getAccountEnabled();
    }
}
