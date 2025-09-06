package fr.xenonbyte.optifact.backend.application.product;

import fr.xenonbyte.optifact.backend.application.product.exception.ProductIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.port.in.DeleteProductByIdUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;

import java.util.UUID;
import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class DeleteProductByIdApplicationService implements DeleteProductByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(DeleteProductByIdApplicationService.class.getName());

    private final ProductRepository repository;

    public DeleteProductByIdApplicationService(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public void deleteProduct(UUID productId) {
        LOGGER.info("deleting product with id: '" + productId + "'" );
        Product product = repository.findById(productId)
                .orElseThrow(() -> new ProductIdNotFoundException(productId));

        repository.delete(product);
        LOGGER.info("Product with id: '" + productId + "' deleted successfully");
    }
}
