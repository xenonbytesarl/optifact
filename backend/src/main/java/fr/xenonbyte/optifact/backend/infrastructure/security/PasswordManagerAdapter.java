package fr.xenonbyte.optifact.backend.infrastructure.security;

import fr.xenonbyte.optifact.backend.application.user.port.out.PasswordManager;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;


@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter
public final class PasswordManagerAdapter extends BCryptPasswordEncoder implements PasswordManager {

    private final BCryptPasswordEncoder encoder;

    public PasswordManagerAdapter() {
        // strength 10 is a good default balancing security and performance
        this.encoder = new BCryptPasswordEncoder(10);
    }

    @Override
    public String encrypt(String password) {
        return encoder.encode(password);
    }
}
