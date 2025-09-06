package fr.xenonbyte.optifact.backend.application.product;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.product.port.in.SearchProductsUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.application.productcategory.port.out.ProductCategoryRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;

import java.util.logging.Logger;


/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SearchProductsApplicationService implements SearchProductsUseCase {

    private static final Logger LOGGER = Logger.getLogger(SearchProductsApplicationService.class.getName());

    private final ProductRepository repository;

    public SearchProductsApplicationService(ProductRepository repository) {
        this.repository = repository;
    }
    
    @Override
    public Pagination<Product> searchProduct(String nameFilter, String codeFilter,
                                             String categoryNameFilter, String typeFilter, CommonSearch search) {
        LOGGER.info("Searching products with nameFilter: '" + nameFilter + "', typeFilter: '" + typeFilter
                + "', categoryNameFilter: '" + categoryNameFilter + "', codeFilter: '" + codeFilter + "'" );

        Pagination<Product> productProductsPage = repository.search(nameFilter, codeFilter, categoryNameFilter, typeFilter, search);

        LOGGER.info("Found " + productProductsPage.elements().size() + " products (total: " + productProductsPage.totalElements() + ")");
        return productProductsPage;
        
    }
}
