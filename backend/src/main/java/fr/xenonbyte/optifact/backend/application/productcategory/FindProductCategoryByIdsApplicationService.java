package fr.xenonbyte.optifact.backend.application.productcategory;

import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.FindProductCategoryByIdUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.FindProductCategoryByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.out.ProductCategoryRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindProductCategoryByIdsApplicationService implements FindProductCategoryByIdsUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindProductCategoryByIdsApplicationService.class.getName());

    private final ProductCategoryRepository repository;

    public FindProductCategoryByIdsApplicationService(ProductCategoryRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<ProductCategory> findProductCategoryById(Set<UUID> categoryIds) {
        LOGGER.info("Find product categories for ids: '" + categoryIds + "'" );

        List<ProductCategory> productCategories = repository.findByIds(categoryIds);

        LOGGER.info("Product categories found successfully for ids: '" + categoryIds + "'" );
        return productCategories;
    }
}
