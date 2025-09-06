package fr.xenonbyte.optifact.backend.infrastructure.productcategory;

import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Mapper
public interface ProductCategoryMapperJpa {

    ProductCategoryJpa toJpa(ProductCategory productCategory);
    ProductCategory toDomain(ProductCategoryJpa productCategoryJpa);

    @ObjectFactory
    default ProductCategory createProductCategory(ProductCategoryJpa productCategoryJpa) {
        return ProductCategory.create(
                productCategoryJpa.getId(),
                productCategoryJpa.getCreatedAt(),
                productCategoryJpa.getUpdatedAt(),
                productCategoryJpa.getName(),
                productCategoryJpa.getActive()
        );
    }
}
