package fr.xenonbyte.optifact.backend.application.productcategory;

import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryNameConflictException;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.FindProductCategoryByIdUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.UpdateProductCategoryUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.out.ProductCategoryRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;

import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindProductCategoryByIdApplicationService implements FindProductCategoryByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindProductCategoryByIdApplicationService.class.getName());

    private final ProductCategoryRepository repository;

    public FindProductCategoryByIdApplicationService(ProductCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProductCategory createProductCategory(UUID categoryId) {
        LOGGER.info("Find product category with id: '" + categoryId + "'" );

        ProductCategory productCategory = repository.findById(categoryId)
                .orElseThrow(() -> new ProductCategoryIdNotFoundException(categoryId));

        LOGGER.info("Product category found successfully with id: '" + categoryId + "'" );
        return productCategory;
    }
}
