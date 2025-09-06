package fr.xenonbyte.optifact.backend.application.productcategory;

import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryNameConflictException;
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
public final class UpdateProductCategoryApplicationService implements UpdateProductCategoryUseCase {

    private static final Logger LOGGER = Logger.getLogger(UpdateProductCategoryApplicationService.class.getName());

    private final ProductCategoryRepository repository;

    public UpdateProductCategoryApplicationService(ProductCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public ProductCategory updateProductCategory(UUID categoryId, ProductCategory productCategory) {
        LOGGER.info("Updating product category with id: '" + categoryId + "'");

        Optional<ProductCategory> optional = repository.findById(categoryId);

        if(optional.isEmpty()) {
            throw new ProductCategoryIdNotFoundException(categoryId);
        }

        if(Boolean.TRUE.equals(repository.existByNameExcludingId(productCategory.getName(), categoryId))) {
            throw new ProductCategoryNameConflictException(productCategory.getName());
        }

        ProductCategory existing = optional.get();
        existing = existing.update(productCategory.getName());

        productCategory = repository.save(existing);

        LOGGER.info("Product category updated successfully with id: '" + productCategory.getId() + "'");

        return productCategory;
    }
}
