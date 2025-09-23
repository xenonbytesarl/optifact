package fr.xenonbyte.optifact.backend.api.user;

import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginPendingResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginSuccessResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.PrivilegeView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.RolePageResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.RoleView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserPageResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.user.payload.AuthResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.LoginResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.MfaResponse;
import fr.xenonbyte.optifact.backend.domain.user.Privilege;
import fr.xenonbyte.optifact.backend.domain.user.Role;
import fr.xenonbyte.optifact.backend.domain.user.User;
import org.mapstruct.Mapper;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Mapper
public interface UserMapperView {

    default Set<UUID> extractRoleIds(UserApiRequestView request) {
        if (request == null || request.getRoles() == null) return Collections.emptySet();
        return request.getRoles().stream()
                .filter(Objects::nonNull)
                .map(RoleView::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());
    }

    default UserResponseView toResponseView(User domain) {
        if (domain == null) return null;
        UserResponseView view = new UserResponseView()
                .id(domain.getId())
                .firstname(domain.getFirstname())
                .lastname(domain.getLastname())
                .email(domain.getEmail())
                .phone(domain.getPhone())
                .accountEnabled(Boolean.TRUE.equals(domain.getAccountEnabled()))
                .accountLocked(Boolean.TRUE.equals(domain.getAccountLocked()))
                .accountExpired(Boolean.TRUE.equals(domain.getAccountExpired()))
                .credentialExpired(Boolean.TRUE.equals(domain.getCredentialExpired()))
                .mfaEnabled(Boolean.TRUE.equals(domain.getMfaEnabled()))
                .totalLoginAttempt(domain.getTotalLoginAttempt())
                .actorId(domain.getActorId());
        List<RoleView> roles = domain.getRoles().stream().map(this::toRoleView).toList();
        view.setRoles(roles);
        return view;
    }

    default RoleView toRoleView(Role role) {
        if (role == null) return null;
        RoleView r = new RoleView()
                .id(role.getId())
                .code(role.getCode())
                .name(role.getName());
        if (role.getPrivileges() != null) {
            List<PrivilegeView> privileges = role.getPrivileges().stream().map(this::toPrivilegeView).toList();
            r.setPrivileges(privileges);
        }
        return r;
    }

    default PrivilegeView toPrivilegeView(Privilege p) {
        if (p == null) return null;
        return new PrivilegeView().id(p.getId()).name(p.getName());
    }

    default RolePageResponseView toRolePageResponseView(Set<Role> roles) {
        List<RoleView> elements = roles == null ? List.of() : roles.stream().map(this::toRoleView).toList();
        return new RolePageResponseView(
                (long) elements.size(),
                1L,
                0L,
                (long) elements.size(),
                Boolean.TRUE,
                Boolean.TRUE,
                elements
        );
    }

    default UserPageResponseView toResponsePageView(Pagination<User> page) {
        List<UserResponseView> elements = page.elements() == null ? List.of() : page.elements().stream().map(this::toResponseView).toList();
        return new UserPageResponseView(
                page.totalElements(),
                page.totalPages(),
                page.page(),
                page.size(),
                page.first(),
                page.last(),
                elements
        );
    }

    default LoginResponseView toLoginSuccessResponseView(LoginResponse loginResponse) {
        return new LoginSuccessResponseView()
                .accessToken(loginResponse.getAccessToken())
                .refreshToken(loginResponse.getRefreshToken());
    }

    default LoginResponseView toLoginPendingResponseView(MfaResponse mfaResponse) {
        return new LoginPendingResponseView()
                .mfaEnable(mfaResponse.isMfaEnabled())
                .email(mfaResponse.getEmail());
    }

    default LoginResponseView toLoginResponseView(AuthResponse authResponse) {
        if(authResponse instanceof LoginResponse loginResponse) {
            return new LoginSuccessResponseView()
                    .accessToken(loginResponse.getAccessToken())
                    .refreshToken(loginResponse.getRefreshToken());
        }
        else if(authResponse instanceof MfaResponse mfaResponse) {
            return new LoginPendingResponseView()
                    .mfaEnable(mfaResponse.isMfaEnabled())
                    .email(mfaResponse.getEmail());
        }
        return new LoginResponseView() {};
    }
}
