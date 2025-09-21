package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.port.in.SearchUsersUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;

import java.util.List;
import java.util.logging.Logger;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SearchUsersApplicationService implements SearchUsersUseCase {

    private static final Logger LOGGER = Logger.getLogger(SearchUsersApplicationService.class.getName());

    private final UserRepository repository;

    public SearchUsersApplicationService(UserRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<User> searchUsers(String nameFilter, String emailFilter, String phoneFilter, String roleNameFilter) {
        LOGGER.info("Searching users with provided filters...");
        return repository.search(nameFilter, emailFilter, phoneFilter, roleNameFilter);
    }
}
