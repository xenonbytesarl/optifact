package fr.xenonbyte.optifact.backend.api.product;

import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductApiRequestView;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductPageResponseView;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.product.port.in.CreateProductUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.in.DeleteProductByIdUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.in.FindProductByIdUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.in.SearchProductsUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.in.UpdateProductUseCase;
import fr.xenonbyte.optifact.backend.application.productcategory.port.in.FindProductCategoryByIdsUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public class ProductAdapterView {

    private final CreateProductUseCase createProductUseCase;
    private final UpdateProductUseCase updateProductUseCase;
    private final FindProductByIdUseCase findProductByIdUseCase;
    private final DeleteProductByIdUseCase deleteProductByIdUseCase;
    private final SearchProductsUseCase searchProductsUseCase;
    private final FindProductCategoryByIdsUseCase findProductCategoryByIdsUseCase;
    private final ProductMapperView mapperView;

    public ProductAdapterView(CreateProductUseCase createProductUseCase,
                              UpdateProductUseCase updateProductUseCase,
                              FindProductByIdUseCase findProductByIdUseCase,
                              DeleteProductByIdUseCase deleteProductByIdUseCase,
                              SearchProductsUseCase searchProductsUseCase, FindProductCategoryByIdsUseCase findProductCategoryByIdsUseCase,
                              ProductMapperView mapperView) {
        this.createProductUseCase = createProductUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.findProductByIdUseCase = findProductByIdUseCase;
        this.deleteProductByIdUseCase = deleteProductByIdUseCase;
        this.searchProductsUseCase = searchProductsUseCase;
        this.findProductCategoryByIdsUseCase = findProductCategoryByIdsUseCase;
        this.mapperView = mapperView;
    }

    public ProductResponseView createProduct(ProductApiRequestView requestView) {
        return mapperView.toResponseView(createProductUseCase.createProduct(mapperView.toDomain(requestView)));
    }

    public ProductResponseView updateProduct(UUID productId, ProductApiRequestView requestView) {
        return mapperView.toResponseView(updateProductUseCase.updateProduct(productId, mapperView.toDomain(requestView)));
    }

    public ProductResponseView findProductById(UUID productId) {
        return mapperView.toResponseView(findProductByIdUseCase.findProductById(productId));
    }

    public void deleteProductById(UUID productId) {
        deleteProductByIdUseCase.deleteProductById(productId);
    }

    public ProductPageResponseView searchProducts(String nameFilter,
                                                  Integer page,
                                                  Integer size,
                                                  String sortField,
                                                  String sortDirection,
                                                  String codeFilter,
                                                  String typeFilter,
                                                  String categoryNameFilter) {

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

        Pagination<Product> productPage = searchProductsUseCase.searchProducts(
                nameFilter,
                codeFilter,
                categoryNameFilter,
                typeFilter,
                new CommonSearch(safePage, safeSize, safeSort, safeDirection)
        );

        // If no elements, return directly without any extra processing
        if (productPage.elements() == null || productPage.elements().isEmpty()) {
            return mapperView.toResponsePageView(productPage);
        }

        // Collect non-null category ids and fetch names only when needed
        Set<UUID> categoryIds = productPage.elements().stream()
                .map(Product::getCategoryId)
                .filter(id -> id != null)
                .collect(Collectors.toSet());

        if (!categoryIds.isEmpty()) {
            Map<UUID, String> categoryNameMap = findProductCategoryByIdsUseCase
                    .findProductCategoryById(categoryIds)
                    .stream()
                    .collect(Collectors.toMap(BaseEntity::getId, ProductCategory::getName));

            if (!categoryNameMap.isEmpty()) {
                ProductPageResponseView responsePageView = mapperView.toResponsePageView(productPage);
                return addCategoryNameToResponseView(responsePageView, categoryNameMap);
            }
        }

        return mapperView.toResponsePageView(productPage);
    }

    private ProductPageResponseView addCategoryNameToResponseView(ProductPageResponseView responsePageView, Map<UUID, String> categoryNameMap) {
        List<ProductResponseView> elements = responsePageView.getElements().stream()
                .map(productResponseView -> addCategoryNameToProductResponseView(productResponseView, categoryNameMap))
                .toList();
        responsePageView.setElements(elements);
        return responsePageView;
    }

    private ProductResponseView addCategoryNameToProductResponseView(@Valid ProductResponseView productResponseView, Map<UUID, String> categoryNameMap) {
        String categoryName = categoryNameMap.getOrDefault(productResponseView.getCategoryId(), "Unknown");
        productResponseView.setCategoryName(categoryName);
        return productResponseView;
    }
}
