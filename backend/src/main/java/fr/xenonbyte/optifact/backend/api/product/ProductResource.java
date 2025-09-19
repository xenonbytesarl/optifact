package fr.xenonbyte.optifact.backend.api.product;

import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.api.product.generated.ProductsApi;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ApiSuccessResponse;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductApiRequestView;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductApiResponseView;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductPageApiResponseView;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.Locale;
import java.util.UUID;

import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.CONTENT;
import static java.util.Map.of;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@RestController
public class ProductResource implements ProductsApi {

    private final ProductAdapterView adapterView;

    public ProductResource(ProductAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<ProductApiResponseView> createProduct(String acceptLanguage, ProductApiRequestView productApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new ProductApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(CREATED.name())
                        .message(MessageUtil.getMessage(ProductMessageView.PRODUCT_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.createProduct(productApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<ApiSuccessResponse> deleteProduct(String acceptLanguage, UUID productId) {
        adapterView.deleteProductById(productId);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ProductMessageView.PRODUCT_DELETED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
        );
    }

    @Override
    public ResponseEntity<ProductApiResponseView> findProductById(String acceptLanguage, UUID productId) {
        return ResponseEntity.status(OK).body(
                new ProductApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ProductMessageView.PRODUCT_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findProductById(productId)))
        );
    }

    @Override
    public ResponseEntity<ProductPageApiResponseView> searchProducts(String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String nameFilter, String claimNameFilter, String codeFilter, String typeFilter, String categoryNameFilter) {
        return ResponseEntity.status(OK).body(
                new ProductPageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ProductMessageView.PRODUCTS_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchProducts(nameFilter, claimNameFilter, page, size, sortField, sortDirection, codeFilter, typeFilter, categoryNameFilter)))
        );
    }

    @Override
    public ResponseEntity<ProductApiResponseView> updateProduct(String acceptLanguage, UUID productId, ProductApiRequestView productApiRequestView) {
        return ResponseEntity.status(OK).body(
                new ProductApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ProductMessageView.PRODUCT_UPDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.updateProduct(productId, productApiRequestView)))
        );
    }
}
