package fr.xenonbyte.optifact.backend.infrastructure.productcategory;

import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Mapper(injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface ProductCategoryMapperJpa {

    ProductCategoryJpa toJpa(ProductCategory productCategory);
    ProductCategory toDomain(ProductCategoryJpa productCategoryJpa);
}
