package fr.xenonbyte.optifact.backend.application.productcategory;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.FindProductCategoryByIdUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.SearchProductCategoriesUseCase;
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
public final class SearchProductCategoriesApplicationService implements SearchProductCategoriesUseCase {

    private static final Logger LOGGER = Logger.getLogger(SearchProductCategoriesApplicationService.class.getName());

    private final ProductCategoryRepository repository;

    public SearchProductCategoriesApplicationService(ProductCategoryRepository repository) {
        this.repository = repository;
    }
    
    @Override
    public Pagination<ProductCategory> createProductCategory(String nameFilter, CommonSearch search) {
        LOGGER.info("Searching product category with nameFilter: '" + nameFilter + "'" );

        Pagination<ProductCategory> productCategoriesPage = repository.search(nameFilter, search);

        LOGGER.info("Found " + productCategoriesPage.elements().size() + " product categories (total: " + productCategoriesPage.totalElements() + ")");
        return productCategoriesPage;
        
    }
}
