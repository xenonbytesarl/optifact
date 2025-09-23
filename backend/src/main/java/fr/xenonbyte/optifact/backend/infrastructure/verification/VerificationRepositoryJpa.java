package fr.xenonbyte.optifact.backend.infrastructure.verification;

import aj.org.objectweb.asm.commons.Remapper;
import fr.xenonbyte.optifact.backend.infrastructure.user.UserJpa;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VerificationRepositoryJpa extends JpaRepository<VerificationJpa, UUID> {

    Optional<VerificationJpa> findByUserAndStatus(UserJpa user, VerificationStateJpa status);

    Optional<VerificationJpa> findByCodeAndUserAndStatus(String code, UserJpa user, VerificationStateJpa status);

    Optional<VerificationJpa> findByServerIdAndStatus(UUID serverId, VerificationStateJpa status);

    Optional<VerificationJpa> findByCodeAndUser(String code, UserJpa user);
}
