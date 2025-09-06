package fr.xenonbyte.optifact.backend.infrastructure.product;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal.Repository
public interface ProductRepositoryJpa extends JpaRepository<ProductJpa, UUID>, JpaSpecificationExecutor<ProductJpa> {
    Boolean existsByNameEqualsIgnoreCase(String name);
    Boolean existsByCodeEqualsIgnoreCase(String code);

    Boolean existsByNameEqualsIgnoreCaseAndIdNot(String name, UUID productId);
    Boolean existsByCodeEqualsIgnoreCaseAndIdNot(String code, UUID productId);
}
