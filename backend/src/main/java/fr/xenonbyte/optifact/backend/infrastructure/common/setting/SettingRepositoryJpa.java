package fr.xenonbyte.optifact.backend.infrastructure.common.setting;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Hexagonal.Repository
public interface SettingRepositoryJpa extends JpaRepository<SettingJpa, UUID> {
    SettingJpa findFirstByOrderByCreatedAtAsc();
}
