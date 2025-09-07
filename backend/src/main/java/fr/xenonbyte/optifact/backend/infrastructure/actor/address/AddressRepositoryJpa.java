package fr.xenonbyte.optifact.backend.infrastructure.actor.address;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
public interface AddressRepositoryJpa extends JpaRepository<AddressJpa, UUID> {}
