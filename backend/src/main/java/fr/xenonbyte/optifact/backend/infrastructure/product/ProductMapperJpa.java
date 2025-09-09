package fr.xenonbyte.optifact.backend.infrastructure.product;

import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;
import fr.xenonbyte.optifact.backend.domain.product.product.ProductType;
import fr.xenonbyte.optifact.backend.infrastructure.common.attachmenttype.AttachmentTypeJpa;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

import java.util.Currency;
import java.util.stream.Collectors;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Mapper
public interface ProductMapperJpa {

    @Mapping(target = "category", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.productcategory.ProductCategoryJpa.builder().id(product.getCategoryId()).build())")
    @Mapping(target = "attachmentTypes", expression = "java(product.getAttachementTypeIds().stream().map(attachmentTypeId -> fr.xenonbyte.optifact.backend.infrastructure.common.attachmenttype.AttachmentTypeJpa.builder().id(attachmentTypeId).build()).collect(java.util.stream.Collectors.toUnmodifiableList()))")
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
                productJpa.getCurrency() == null? null: Currency.getInstance(productJpa.getCurrency()),
                productJpa.getDescription(),
                productJpa.getAttachmentTypes().stream().map(AttachmentTypeJpa::getId).toList()
        );
    }
}
