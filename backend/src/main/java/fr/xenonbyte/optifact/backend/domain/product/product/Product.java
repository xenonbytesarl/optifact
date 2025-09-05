package fr.xenonbyte.optifact.backend.domain.product.product;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.product.product.message.ProductMessage;

import java.math.BigDecimal;
import java.util.UUID;

import static java.util.UUID.randomUUID;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Product extends BaseEntity {
    private final String code;
    private final String name;
    private final UUID categoryId;
    private final ProductType type;
    private final Double rate;
    private final BigDecimal amount; // optional
    private final String currency; // optional (ISO code like "EUR", "USD")
    private final String description; // optional
    private final Boolean active;

    public Product(UUID id,
                   String code,
                   String name,
                   UUID categoryId,
                   ProductType type,
                   Double rate,
                   BigDecimal amount,
                   String currency,
                   String description,
                   Boolean active) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.categoryId = categoryId;
        this.type = type;
        this.rate = rate;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
        this.active = active;
    }

    public Product create(String code,
                          String name,
                          UUID categoryId,
                          ProductType type,
                          Double rate,
                          BigDecimal amount,
                          String currency,
                          String description) {
        validateParams(code, name, categoryId, type, rate, amount);
        return new Product(
                randomUUID(),
                code.trim(),
                name.trim(),
                categoryId,
                type,
                rate,
                normalizeAmount(amount),
                normalizeCurrency(currency),
                normalizeDescription(description),
                true
        );
    }

    public Product update(String code,
                          String name,
                          UUID categoryId,
                          ProductType type,
                          Double rate,
                          BigDecimal amount,
                          String currency,
                          String description) {
        validateParams(code, name, categoryId, type, rate, amount);
        Product product = new Product(id, code.trim(), name.trim(), categoryId, type, rate, normalizeAmount(amount), normalizeCurrency(currency), normalizeDescription(description), true);
        product.updateAudit(createdAt);
        return product;
    }

    public Product withActive(Boolean active) {
        Product product = new Product(id, code, name, categoryId, type, rate, amount, currency, description, active);
        product.updateAudit(createdAt);
        return product;
    }

    private void validateParams(String code,
                                String name,
                                UUID categoryId,
                                ProductType type,
                                Double rate,
                                BigDecimal amount) {
        if (code == null || code.isBlank()) {
            throw new IllegalArgumentException(ProductMessage.PRODUCT_CODE_REQUIRED);
        }
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException(ProductMessage.PRODUCT_NAME_REQUIRED);
        }
        if (categoryId == null) {
            throw new IllegalArgumentException(ProductMessage.PRODUCT_CATEGORY_ID_REQUIRED);
        }
        if (type == null) {
            throw new IllegalArgumentException(ProductMessage.PRODUCT_TYPE_REQUIRED);
        }

        if (rate != null && rate < 0) {
            throw new IllegalArgumentException(ProductMessage.PRODUCT_RATE_INVALID);
        }
        if (amount != null && amount.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException(ProductMessage.PRODUCT_AMOUNT_INVALID);
        }
    }

    private static BigDecimal normalizeAmount(BigDecimal amount) {
        return amount == null ? null : amount.stripTrailingZeros();
    }

    private static String normalizeCurrency(String currency) {
        return currency == null ? null : currency.trim();
    }

    private static String normalizeDescription(String description) {
        return description == null ? null : description.trim();
    }
}
