package fr.xenonbyte.optifact.backend.application.productcategory;

import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.DeleteProductCategoryByIdUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.FindProductCategoryByIdUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.out.ProductCategoryRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;

import java.util.UUID;
import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class DeleteProductCategoryByIdApplicationService implements DeleteProductCategoryByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(DeleteProductCategoryByIdApplicationService.class.getName());

    private final ProductCategoryRepository repository;

    public DeleteProductCategoryByIdApplicationService(ProductCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public void deleteProductCategoryById(UUID categoryId) {
        LOGGER.info("deleting product category with id: '" + categoryId + "'" );
        ProductCategory productCategory = repository.findById(categoryId)
                .orElseThrow(() -> new ProductCategoryIdNotFoundException(categoryId));

        repository.delete(productCategory);
        LOGGER.info("Product category with id: '" + categoryId + "' deleted successfully");
    }
}
