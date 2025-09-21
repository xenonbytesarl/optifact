package fr.xenonbyte.optifact.backend.api.user;

import fr.xenonbyte.optifact.backend.api.user.generated.view.RolePageResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserResponseView;
import fr.xenonbyte.optifact.backend.application.user.port.in.CreateUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindRolesUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindUserByEmailUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindUserByIdUseCase;
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
    private final FindUserByIdUseCase findUserByIdUseCase;
    private final FindUserByEmailUseCase findUserByEmailUseCase;
    private final FindRolesUseCase findRolesUseCase;
    private final UserMapperView mapperView;

    public UserAdapterView(CreateUserUseCase createUserUseCase,
                           FindUserByIdUseCase findUserByIdUseCase,
                           FindUserByEmailUseCase findUserByEmailUseCase,
                           FindRolesUseCase findRolesUseCase,
                           UserMapperView mapperView) {
        this.createUserUseCase = createUserUseCase;
        this.findUserByIdUseCase = findUserByIdUseCase;
        this.findUserByEmailUseCase = findUserByEmailUseCase;
        this.findRolesUseCase = findRolesUseCase;
        this.mapperView = mapperView;
    }

    public UserResponseView createUser(UserApiRequestView request) {
        // Extract selected roles from request and resolve full Role aggregates from domain
        java.util.Set<java.util.UUID> roleIds = mapperView.extractRoleIds(request);
        java.util.Set<fr.xenonbyte.optifact.backend.domain.user.Role> selectedRoles = findRolesUseCase.findRoles().stream()
                .filter(r -> r.getId() != null && roleIds.contains(r.getId()))
                .collect(java.util.stream.Collectors.toSet());

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

    public UserResponseView findUserById(UUID id) {
        return mapperView.toResponseView(findUserByIdUseCase.findById(id));
    }

    public UserResponseView findUserByEmail(String email) {
        return mapperView.toResponseView(findUserByEmailUseCase.findByEmail(email));
    }

    public RolePageResponseView findRoles() {
        return mapperView.toRolePageResponseView(findRolesUseCase.findRoles());
    }
}
