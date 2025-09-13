package fr.xenonbyte.optifact.backend.application.product;

import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepository;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductCodeConflictException;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductNameConflictException;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductProductCategoryIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductSequenceIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.port.in.CreateProductUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.productcategory.port.out.ProductCategoryRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;

import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateProductApplicationService implements CreateProductUseCase {
    
    private static final Logger LOGGER = Logger.getLogger(CreateProductApplicationService.class.getName());
    
    private final ProductRepository repository;
    private final ProductCategoryRepository productCategoryRepository;
    private final SequenceRepository sequenceRepository;

    public CreateProductApplicationService(
            ProductRepository repository,
            ProductCategoryRepository productCategoryRepository,
            SequenceRepository sequenceRepository) {
        this.repository = repository;
        this.productCategoryRepository = productCategoryRepository;
        this.sequenceRepository = sequenceRepository;
    }

    @Override
    public Product createProduct(Product product) {
        LOGGER.info("Creating product...");

        if(Boolean.TRUE.equals(repository.existByName(product.getName()))) {
            throw new ProductNameConflictException(product.getName());
        }

        if(Boolean.TRUE.equals(repository.existByCode(product.getCode()))) {
            throw new ProductCodeConflictException(product.getCode());
        }

        if(!productCategoryRepository.existById(product.getCategoryId())) {
            throw new ProductProductCategoryIdNotFoundException(product.getCategoryId());
        }

        if(product.getSequenceId() != null && !sequenceRepository.existById(product.getSequenceId())) {
            throw new ProductSequenceIdNotFoundException(product.getSequenceId());
        }

        product = repository.save(product);

        LOGGER.info("Product created successfully with id: '" + product.getId() + "'");

        return product;
    }
}
