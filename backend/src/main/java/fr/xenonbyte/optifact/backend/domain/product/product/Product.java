package fr.xenonbyte.optifact.backend.domain.product.product;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.product.product.message.ProductMessage;

import java.math.BigDecimal;
import java.util.Currency;
import java.util.List;
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
    private final Currency currency; // optional (ISO code like "EUR", "USD")
    private final String description; // optional
    private final Boolean active;
    private final UUID sequenceId;
    private final List<UUID> attachementTypeIds;

    public Product(UUID id,
                   String code,
                   String name,
                   UUID categoryId,
                   ProductType type,
                   Double rate,
                   BigDecimal amount,
                   Currency currency,
                   String description,
                   Boolean active,
                   UUID sequenceId,
                   List<UUID> attachementTypeIds) {
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
        this.sequenceId = sequenceId;
        this.attachementTypeIds = attachementTypeIds;
    }

    public static Product create(String code,
                                 String name,
                                 UUID categoryId,
                                 ProductType type,
                                 Double rate,
                                 BigDecimal amount,
                                 Currency currency,
                                 String description,
                                 UUID sequenceId,
                                 List<UUID> attachementTypeIds) {
        validateParams(code, name, categoryId, type, rate, amount);
        return new Product(
                randomUUID(),
                code.trim(),
                name.trim(),
                categoryId,
                type,
                rate,
                normalizeAmount(amount),
                currency,
                normalizeDescription(description),
                true,
                sequenceId,
                attachementTypeIds == null? List.of() : attachementTypeIds
        );
    }

    public static Product create(
              UUID id,
              String code,
              String name,
              UUID categoryId,
              ProductType type,
              Double rate,
              BigDecimal amount,
              Currency currency,
              String description,
              UUID sequenceId,
              List<UUID> attachementTypeIds) {
        validateParams(code, name, categoryId, type, rate, amount);
        return new Product(
                id,
                code.trim(),
                name.trim(),
                categoryId,
                type,
                rate,
                normalizeAmount(amount),
                currency,
                normalizeDescription(description),
                true,
                sequenceId,
                attachementTypeIds == null? java.util.List.of() : attachementTypeIds
        );
    }

    public Product update(String code,
                          String name,
                          UUID categoryId,
                          ProductType type,
                          Double rate,
                          BigDecimal amount,
                          Currency currency,
                          String description,
                          UUID sequenceId,
                          List<UUID> attachementTypeIds) {
        validateParams(code, name, categoryId, type, rate, amount);
        Product product = new Product(
                id, 
                code.trim(), 
                name.trim(), 
                categoryId, 
                type, 
                rate, 
                normalizeAmount(amount), 
                currency, 
                normalizeDescription(description), 
                active,
                sequenceId,
                attachementTypeIds
        );
        product.updateAudit(createdAt);
        return product;
    }

    public Product withActive(Boolean active) {
        Product product = new Product(id, code, name, categoryId, type, rate, amount, currency, description, active, this.sequenceId, attachementTypeIds);
        product.updateAudit(createdAt);
        return product;
    }

    private static void validateParams(String code,
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

    private static String normalizeDescription(String description) {
        return description == null ? null : description.trim();
    }

    public String getCode() {
        return code;
    }

    public String getName() {
        return name;
    }

    public UUID getCategoryId() {
        return categoryId;
    }

    public ProductType getType() {
        return type;
    }

    public Double getRate() {
        return rate;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public Currency getCurrency() {
        return currency;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getActive() {
        return active;
    }

    public UUID getSequenceId() {
        return sequenceId;
    }

    public List<UUID> getAttachementTypeIds() {
        return attachementTypeIds;
    }
}
