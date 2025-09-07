package fr.xenonbyte.optifact.backend.api.productcategory;

import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ProductCategoryApiRequestView;
import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ProductCategoryPageResponseView;
import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ProductCategoryResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.CreateProductCategoryUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.DeleteProductCategoryByIdUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.FindProductCategoryByIdUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.SearchProductCategoriesUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.UpdateProductCategoryUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 06/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public class ProductCategoryAdapterView {
    private final CreateProductCategoryUseCase createProductCategoryUseCase;
    private final UpdateProductCategoryUseCase updateProductCategoryUseCase;
    private final FindProductCategoryByIdUseCase findProductCategoryByIdUseCase;
    private final DeleteProductCategoryByIdUseCase deleteProductCategoryByIdUseCase;
    private final SearchProductCategoriesUseCase searchProductCategoriesUseCase;
    private final ProductCategoryMapperView mapperView;

    public ProductCategoryAdapterView(
            CreateProductCategoryUseCase createProductCategoryUseCase,
            UpdateProductCategoryUseCase updateProductCategoryUseCase,
            FindProductCategoryByIdUseCase findProductCategoryByIdUseCase,
            DeleteProductCategoryByIdUseCase deleteProductCategoryByIdUseCase,
            SearchProductCategoriesUseCase searchProductCategoriesUseCase,
            ProductCategoryMapperView mapperView) {
        this.createProductCategoryUseCase = createProductCategoryUseCase;
        this.updateProductCategoryUseCase = updateProductCategoryUseCase;
        this.findProductCategoryByIdUseCase = findProductCategoryByIdUseCase;
        this.deleteProductCategoryByIdUseCase = deleteProductCategoryByIdUseCase;
        this.searchProductCategoriesUseCase = searchProductCategoriesUseCase;
        this.mapperView = mapperView;
    }

    public ProductCategoryResponseView createProductCategory(ProductCategoryApiRequestView requestView) {
        return mapperView.toResponseView(createProductCategoryUseCase.createProductCategory(mapperView.toDomain(requestView)));
    }

    public ProductCategoryResponseView updateProductCategory(UUID categoryId, ProductCategoryApiRequestView requestView) {
        return mapperView.toResponseView(updateProductCategoryUseCase.updateProductCategory(categoryId, mapperView.toDomain(requestView)));
    }

    public ProductCategoryResponseView findProductCategoryById(UUID categoryId) {
        return mapperView.toResponseView(findProductCategoryByIdUseCase.findProductCategoryById(categoryId));
    }

    public void deleteProductCategoryById(UUID categoryId) {
        deleteProductCategoryByIdUseCase.deleteProductCategoryById(categoryId);
    }

    public ProductCategoryPageResponseView searchProductCategories(String nameFilter, Integer page, Integer size, String sortField, String sortDirection) {
        // Defaults and normalization to avoid NPEs and IllegalArgumentException
        long safePage = page == null ? 0L : page.longValue();
        long safeSize = size == null ? 20L : size.longValue();
        String safeSort = (sortField == null || sortField.isBlank()) ? "name" : sortField;
        Direction safeDirection;
        if (sortDirection == null) {
            safeDirection = Direction.ASC;
        } else {
            try {
                safeDirection = Direction.valueOf(sortDirection.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                safeDirection = Direction.ASC;
            }
        }
        return mapperView.toResponsePageView(searchProductCategoriesUseCase.searchProductCategories(
                nameFilter, new CommonSearch(safePage, safeSize, safeSort, safeDirection)));
    }

}
