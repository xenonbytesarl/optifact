package fr.xenonbyte.optifact.backend.application.user.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;


@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface CreateUserPasswordUseCase {

    void createUserPassword(UUID userId, String password, String confirmPassword, String verificationCode);
}
