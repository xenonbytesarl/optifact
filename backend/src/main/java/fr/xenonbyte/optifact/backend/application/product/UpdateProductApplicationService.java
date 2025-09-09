package fr.xenonbyte.optifact.backend.application.product;


import fr.xenonbyte.optifact.backend.application.product.exception.ProductCodeConflictException;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductNameConflictException;
import fr.xenonbyte.optifact.backend.application.product.port.in.UpdateProductUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;

import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class UpdateProductApplicationService implements UpdateProductUseCase {

    private static final Logger LOGGER = Logger.getLogger(UpdateProductApplicationService.class.getName());

    private final ProductRepository repository;

    public UpdateProductApplicationService(ProductRepository repository) {
        this.repository = repository;
    }

    @Override
    public Product updateProduct(UUID productId, Product product) {
        LOGGER.info("Updating product with id: '" + productId + "'");

        Optional<Product> optional = repository.findById(productId);

        if(optional.isEmpty()) {
            throw new ProductIdNotFoundException(productId);
        }

        if(Boolean.TRUE.equals(repository.existByNameExcludingId(product.getName(), productId))) {
            throw new ProductNameConflictException(product.getName());
        }

        if(Boolean.TRUE.equals(repository.existByCodeExcludingId(product.getCode(), productId))) {
            throw new ProductCodeConflictException(product.getName());
        }

        Product existing = optional.get();
        existing = existing.update(
                product.getCode(),
                product.getName(),
                product.getCategoryId(),
                product.getType(),
                product.getRate(),
                product.getAmount(),
                product.getCurrency(),
                product.getDescription(),
                product.getAttachementTypeIds()
        );

        product = repository.save(existing);

        LOGGER.info("Product updated successfully with id: '" + product.getId() + "'");

        return product;
    }
}
