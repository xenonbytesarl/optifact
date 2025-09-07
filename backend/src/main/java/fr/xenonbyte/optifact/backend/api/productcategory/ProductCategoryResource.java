package fr.xenonbyte.optifact.backend.api.productcategory;

import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.api.productcategory.generated.ProductCategoriesApi;
import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ApiSuccessResponse;
import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ProductCategoryApiRequestView;
import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ProductCategoryApiResponseView;
import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ProductCategoryPageApiResponseView;
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
 * @since 06/09/2025
 */
@RestController
public class ProductCategoryResource implements ProductCategoriesApi {

    private final ProductCategoryAdapterView adapterView;

    public ProductCategoryResource(ProductCategoryAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<ProductCategoryApiResponseView> createProductCategory(
            String acceptLanguage, ProductCategoryApiRequestView productCategoryApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new ProductCategoryApiResponseView()
                    .timestamp(ZonedDateTime.now().toString())
                    .success(true)
                    .status(CREATED.name())
                    .message(MessageUtil.getMessage(ProductCategoryMessageView.PRODUCT_CATEGORY_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                    .data(of(CONTENT, adapterView.createProductCategory(productCategoryApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<ApiSuccessResponse> deleteProductCategory(String acceptLanguage, UUID categoryId) {
        adapterView.deleteProductCategoryById(categoryId);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ProductCategoryMessageView.PRODUCT_CATEGORY_DELETED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))

        );
    }

    @Override
    public ResponseEntity<ProductCategoryApiResponseView> findProductCategoryById(String acceptLanguage, UUID categoryId) {
        return ResponseEntity.status(OK).body(
                new ProductCategoryApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ProductCategoryMessageView.PRODUCT_CATEGORY_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findProductCategoryById(categoryId)))
        );
    }

    @Override
    public ResponseEntity<ProductCategoryPageApiResponseView> searchProductCategories(
            String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String nameFilter) {
        return ResponseEntity.status(OK).body(
                new ProductCategoryPageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ProductCategoryMessageView.PRODUCT_CATEGORIES_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchProductCategories(nameFilter, page, size, sortField, sortDirection)))
        );
    }

    @Override
    public ResponseEntity<ProductCategoryApiResponseView> updateProductCategory(
            String acceptLanguage, UUID categoryId, ProductCategoryApiRequestView productCategoryApiRequestView) {
        return ResponseEntity.status(OK).body(
                new ProductCategoryApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ProductCategoryMessageView.PRODUCT_CATEGORY_UPDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.updateProductCategory(categoryId, productCategoryApiRequestView)))
        );
    }
}
