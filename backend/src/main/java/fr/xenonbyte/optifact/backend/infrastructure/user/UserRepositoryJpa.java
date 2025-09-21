package fr.xenonbyte.optifact.backend.infrastructure.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.Optional;
import java.util.UUID;

public interface UserRepositoryJpa extends JpaRepository<UserJpa, UUID>, JpaSpecificationExecutor<UserJpa> {
    Optional<UserJpa> findByEmailIgnoreCase(String email);
    boolean existsByEmailIgnoreCase(String email);
}
