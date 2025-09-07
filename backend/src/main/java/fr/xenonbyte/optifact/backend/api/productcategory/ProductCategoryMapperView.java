package fr.xenonbyte.optifact.backend.api.productcategory;

import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ProductCategoryApiRequestView;
import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ProductCategoryPageResponseView;
import fr.xenonbyte.optifact.backend.api.productcategory.generated.view.ProductCategoryResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

/**
 * @author bamk
 * @version 1.0
 * @since 06/09/2025
 */
@Mapper
public interface ProductCategoryMapperView {

    ProductCategory toDomain(ProductCategoryApiRequestView requestView);

    ProductCategoryResponseView toResponseView(ProductCategory productCategory);

    ProductCategoryPageResponseView toResponsePageView(Pagination<ProductCategory> productCategoryPage);

    @ObjectFactory
    default ProductCategory createProductCategory(ProductCategoryApiRequestView requestView) {
        return ProductCategory.create(requestView.getName());
    }
}
