package fr.xenonbyte.optifact.backend.domain.product.product;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.VALUE_OBJECT)
@Hexagonal.ValueObject
public enum ProductType {
    PERCENTAGE,
    FLAT_AMOUNT
}
