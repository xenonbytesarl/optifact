package fr.xenonbyte.optifact.backend.infrastructure.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RoleRepositoryJpa extends JpaRepository<RoleJpa, UUID> {
}
