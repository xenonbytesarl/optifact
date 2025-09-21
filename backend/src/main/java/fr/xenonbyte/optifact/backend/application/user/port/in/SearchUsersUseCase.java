package fr.xenonbyte.optifact.backend.application.user.port.in;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;


@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface SearchUsersUseCase {

    Pagination<User> searchUsers(String nameFilter, String emailFilter, String phoneFilter, String roleNameFilter, CommonSearch search);
}
