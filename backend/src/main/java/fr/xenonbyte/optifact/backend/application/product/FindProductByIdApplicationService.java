package fr.xenonbyte.optifact.backend.application.product;

import fr.xenonbyte.optifact.backend.application.product.exception.ProductIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.port.in.FindProductByIdUseCase;
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
public final class FindProductByIdApplicationService implements FindProductByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindProductByIdApplicationService.class.getName());

    private final ProductRepository repository;

    public FindProductByIdApplicationService(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Product findProductById(UUID productId) {
        LOGGER.info("Find product with id: '" + productId + "'" );

        Product product = repository.findById(productId)
                .orElseThrow(() -> new ProductIdNotFoundException(productId));

        LOGGER.info("Product found successfully with id: '" + productId + "'" );
        return product;
    }
}
