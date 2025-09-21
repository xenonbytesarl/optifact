package fr.xenonbyte.optifact.backend.application.user.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;

import java.util.UUID;


@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface UpdateUserUseCase {

    User updateUser(UUID userId, User user);
}
