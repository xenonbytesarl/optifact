package fr.xenonbyte.optifact.backend.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class BcryptGenTest {

    @Test
    void generateHash() {
        String raw = "Cosumaf2509!";
        String hash = new BCryptPasswordEncoder(10).encode(raw);
        System.out.println("[DEBUG_LOG] bcrypt_hash=" + hash);
    }
}
