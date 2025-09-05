package fr.xenonbyte.optifact.backend.application.productcategory;

import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryNameConflictException;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.CreateProductCategoryUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.out.ProductCategoryRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;

import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateProductCategoryApplicationService implements CreateProductCategoryUseCase {
    
    private static final Logger LOGGER = Logger.getLogger(CreateProductCategoryApplicationService.class.getName());
    
    private final ProductCategoryRepository repository;

    public CreateProductCategoryApplicationService(ProductCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProductCategory createProductCategory(ProductCategory productCategory) {
        LOGGER.info("Creating product category...");

        if(Boolean.TRUE.equals(repository.existByName(productCategory.getName()))) {
            throw new ProductCategoryNameConflictException(productCategory.getName());
        }

        productCategory = repository.save(productCategory);

        LOGGER.info("Product category created successfully with id: '" + productCategory.getId() + "'");

        return productCategory;
    }
}
