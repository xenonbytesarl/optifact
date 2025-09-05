package fr.xenonbyte.optifact.backend.infrastructure.productcategory;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal.Repository
public interface ProductCategoryRepositoryJpa extends JpaRepository<ProductCategoryJpa, UUID>, JpaSpecificationExecutor<ProductCategoryJpa> {
    Boolean existsByNameEqualsIgnoreCase(String name);

    Boolean existsByNameEqualsIgnoreCaseAndIdNot(String name, UUID categoryId);
}
