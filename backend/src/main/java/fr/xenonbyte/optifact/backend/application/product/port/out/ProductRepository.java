package fr.xenonbyte.optifact.backend.application.product.port.out;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;

import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.Repository
@Hexagonal.SecondaryPort
public interface ProductRepository {

    Product save(Product product);

    Optional<Product> findById(UUID categoryId);

    Pagination<Product> search(String nameFilter, String claimNameFilter, String codeFilter, String categoryNameFilter, String typeFilter, CommonSearch search);

    Boolean existByName(String name);

    Boolean existByCode(String code);

    Boolean existById(UUID categoryId);

    Boolean existByNameExcludingId(String name, UUID categoryId);

    Boolean existByCodeExcludingId(String code, UUID productId);

    void delete(Product product);

    boolean existsById(UUID productId);

    Boolean existByClaimName(String claimName);

    Boolean existByClaimNameExcludingId(String claimName, UUID productId);
}
