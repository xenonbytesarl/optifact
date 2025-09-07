package fr.xenonbyte.optifact.backend.application.product.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface DeleteProductByIdUseCase {
    void deleteProductById(UUID productId);
}
