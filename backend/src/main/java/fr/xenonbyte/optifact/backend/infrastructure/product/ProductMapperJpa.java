package fr.xenonbyte.optifact.backend.infrastructure.product;

import fr.xenonbyte.optifact.backend.domain.product.product.Product;
import fr.xenonbyte.optifact.backend.domain.product.product.ProductType;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

import java.util.Currency;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Mapper
public interface ProductMapperJpa {

    ProductJpa toJpa(Product product);
    Product toDomain(ProductJpa productJpa);

    @ObjectFactory
    default Product createProduct(ProductJpa productJpa) {
        return Product.create(
                productJpa.getId(),
                productJpa.getCode(),
                productJpa.getName(),
                productJpa.getCategory().getId(),
                ProductType.valueOf(productJpa.getType().name()),
                productJpa.getRate(),
                productJpa.getAmount(),
                Currency.getInstance(productJpa.getCurrency()),
                productJpa.getDescription()
        );
    }
}
