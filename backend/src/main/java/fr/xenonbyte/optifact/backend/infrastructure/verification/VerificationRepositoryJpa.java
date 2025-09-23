package fr.xenonbyte.optifact.backend.infrastructure.verification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VerificationRepositoryJpa extends JpaRepository<VerificationJpa, UUID> {

    Optional<VerificationJpa> findByCodeAndUserId(String code, UUID userId);

    Optional<VerificationJpa> findByCodeAndServerId(String code, UUID serverId);
}
