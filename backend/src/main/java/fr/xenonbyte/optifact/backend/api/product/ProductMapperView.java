package fr.xenonbyte.optifact.backend.api.product;

import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductApiRequestView;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductPageResponseView;
import fr.xenonbyte.optifact.backend.api.product.generated.view.ProductResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;
import fr.xenonbyte.optifact.backend.domain.product.product.ProductType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.Map;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Mapper
public interface ProductMapperView {

    Product toDomain(ProductApiRequestView requestView);

    @Mapping(target = "attachmentTypeIds", expression = "java(product.getAttachementTypeIds())")
    ProductResponseView toResponseView(Product product);

    ProductPageResponseView toResponsePageView(Pagination<Product> productPage);

    @ObjectFactory
    default Product createProduct(ProductApiRequestView requestView) {
        // Map OpenAPI enum to domain enum
        ProductType type = requestView.getType() == null ? null : ProductType.valueOf(requestView.getType().getValue());
        // Map currency code to Currency instance (nullable)
        Currency currency = requestView.getCurrency() == null ? null : Currency.getInstance(requestView.getCurrency());
        return Product.create(
                requestView.getCode(),
                requestView.getName(),
                requestView.getCategoryId(),
                type,
                requestView.getRate(),
                requestView.getAmount(),
                currency,
                requestView.getDescription(),
                requestView.getSequenceId(),
                requestView.getAttachmentTypeIds()
        );
    }
}
