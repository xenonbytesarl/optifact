package fr.xenonbyte.optifact.backend.api.user;

import fr.xenonbyte.optifact.backend.api.user.generated.view.CreateUserPasswordRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.RegisterUserApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.RolePageResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserPageResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.user.payload.AuthResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.LoginResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.MfaResponse;
import fr.xenonbyte.optifact.backend.application.user.port.in.CreateUserPasswordUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.CreateUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindRolesUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindUserByEmailUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindUserByIdUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.LoginUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.RegisterUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.SearchUsersUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.UpdateUserUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.Role;
import fr.xenonbyte.optifact.backend.domain.user.User;

import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public final class UserAdapterView {

    private final CreateUserUseCase createUserUseCase;
    private final UpdateUserUseCase updateUserUseCase;
    private final RegisterUserUseCase registerUserUseCase;
    private final CreateUserPasswordUseCase createUserPasswordUseCase;
    private final SearchUsersUseCase searchUsersUseCase;
    private final FindUserByIdUseCase findUserByIdUseCase;
    private final FindUserByEmailUseCase findUserByEmailUseCase;
    private final FindRolesUseCase findRolesUseCase;
    private final UserMapperView mapperView;
    private final LoginUserUseCase loginUserUseCase;

    public UserAdapterView(CreateUserUseCase createUserUseCase,
                           UpdateUserUseCase updateUserUseCase,
                           RegisterUserUseCase registerUserUseCase,
                           CreateUserPasswordUseCase createUserPasswordUseCase,
                           SearchUsersUseCase searchUsersUseCase,
                           FindUserByIdUseCase findUserByIdUseCase,
                           FindUserByEmailUseCase findUserByEmailUseCase,
                           FindRolesUseCase findRolesUseCase,
                           UserMapperView mapperView,
                           LoginUserUseCase loginUserUseCase) {
        this.createUserUseCase = createUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.registerUserUseCase = registerUserUseCase;
        this.createUserPasswordUseCase = createUserPasswordUseCase;
        this.searchUsersUseCase = searchUsersUseCase;
        this.findUserByIdUseCase = findUserByIdUseCase;
        this.findUserByEmailUseCase = findUserByEmailUseCase;
        this.findRolesUseCase = findRolesUseCase;
        this.mapperView = mapperView;
        this.loginUserUseCase = loginUserUseCase;
    }

    public UserResponseView createUser(UserApiRequestView request) {
        // Extract selected roles from request and resolve full Role aggregates from domain
        Set<UUID> roleIds = mapperView.extractRoleIds(request);
        Set<fr.xenonbyte.optifact.backend.domain.user.Role> selectedRoles = findRolesUseCase.findRoles().stream()
                .filter(r -> r.getId() != null && roleIds.contains(r.getId()))
                .collect(Collectors.toSet());

        User toCreate = User.create(
                request.getFirstname(),
                request.getLastname(),
                request.getEmail(),
                request.getPhone(),
                request.getActorId(),
                selectedRoles
        );

        User created = createUserUseCase.createUser(toCreate);
        return mapperView.toResponseView(created);
    }

    public UserResponseView updateUser(UUID id, UserApiRequestView request) {
        Set<UUID> roleIds = mapperView.extractRoleIds(request);
        Set<Role> selectedRoles = findRolesUseCase.findRoles().stream()
                .filter(r -> r.getId() != null && roleIds.contains(r.getId()))
                .collect(Collectors.toSet());

        User toUpdate = User.create(
                request.getFirstname(),
                request.getLastname(),
                request.getEmail(),
                request.getPhone(),
                request.getActorId(),
                selectedRoles
        );

        User updated = updateUserUseCase.updateUser(id, toUpdate);
        return mapperView.toResponseView(updated);
    }

    public UserPageResponseView searchUsers(String nameFilter,
                                             String emailFilter,
                                             String phoneFilter,
                                             String roleNameFilter,
                                             Integer page,
                                             Integer size,
                                             String sortField,
                                             String sortDirection) {
        long safePage = page == null ? 0L : page.longValue();
        long safeSize = size == null ? 20L : size.longValue();
        String safeSort = (sortField == null || sortField.isBlank()) ? "id" : sortField;
        fr.xenonbyte.optifact.backend.application.common.payload.Direction safeDirection;
        if (sortDirection == null) {
            safeDirection = Direction.ASC;
        } else {
            try {
                safeDirection = Direction.valueOf(sortDirection.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                safeDirection = Direction.ASC;
            }
        }

        var result = searchUsersUseCase.searchUsers(
                nameFilter,
                emailFilter,
                phoneFilter,
                roleNameFilter,
                new CommonSearch(safePage, safeSize, safeSort, safeDirection)
        );
        return mapperView.toResponsePageView(result);
    }

    public void registerUser(RegisterUserApiRequestView request) {
        User toRegister = User.create(
                request.getFirstname(),
                request.getLastname(),
                request.getEmail(),
                request.getPhone(),
                null,
                java.util.Collections.emptySet()
        );
        registerUserUseCase.registerUser(toRegister, request.getActorReference());
    }

    public void createUserPassword(UUID id, String code, CreateUserPasswordRequestView request) {
        String password = request.getPassword();
        String confirmPassword = request.getConfirmPassword();
        // In this minimal implementation, use the same value for confirmPassword; verificationCode is not yet supported
        createUserPasswordUseCase.createUserPassword(id, password, confirmPassword, code);
    }

    public UserResponseView findUserById(UUID id) {
        return mapperView.toResponseView(findUserByIdUseCase.findById(id));
    }

    public UserResponseView findUserByEmail(String email) {
        return mapperView.toResponseView(findUserByEmailUseCase.findByEmail(email));
    }

    public RolePageResponseView findRoles() {
        return mapperView.toRolePageResponseView(findRolesUseCase.findRoles());
    }

    public LoginResponseView login(LoginApiRequestView request) {
        return mapperView.toLoginResponseView(loginUserUseCase.login(request.getUsername(), request.getPassword()));
    }
}
