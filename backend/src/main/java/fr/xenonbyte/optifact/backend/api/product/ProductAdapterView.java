package fr.xenonbyte.optifact.backend.api.product;

import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductApiRequestView;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductPageResponseView;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.product.port.in.CreateProductUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.in.DeleteProductByIdUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.in.FindProductByIdUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.in.SearchProductsUseCase;
import fr.xenonbyte.optifact.backend.application.product.port.in.UpdateProductUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

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
    private final ProductMapperView mapperView;

    public ProductAdapterView(CreateProductUseCase createProductUseCase,
                              UpdateProductUseCase updateProductUseCase,
                              FindProductByIdUseCase findProductByIdUseCase,
                              DeleteProductByIdUseCase deleteProductByIdUseCase,
                              SearchProductsUseCase searchProductsUseCase,
                              ProductMapperView mapperView) {
        this.createProductUseCase = createProductUseCase;
        this.updateProductUseCase = updateProductUseCase;
        this.findProductByIdUseCase = findProductByIdUseCase;
        this.deleteProductByIdUseCase = deleteProductByIdUseCase;
        this.searchProductsUseCase = searchProductsUseCase;
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
        deleteProductByIdUseCase.deleteProduct(productId);
    }

    public ProductPageResponseView searchProducts(String nameFilter,
                                                  Integer page,
                                                  Integer size,
                                                  String sortField,
                                                  String sortDirection,
                                                  String codeFilter,
                                                  String typeFilter,
                                                  String categoryNameFilter) {
        return mapperView.toResponsePageView(
                searchProductsUseCase.searchProduct(
                        nameFilter,
                        codeFilter,
                        categoryNameFilter,
                        typeFilter,
                        new CommonSearch(page.longValue(), size.longValue(), sortField, Direction.valueOf(sortDirection))
                )
        );
    }
}
