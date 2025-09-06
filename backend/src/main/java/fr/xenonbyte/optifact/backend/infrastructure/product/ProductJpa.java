package fr.xenonbyte.optifact.backend.infrastructure.product;

import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import fr.xenonbyte.optifact.backend.infrastructure.productcategory.ProductCategoryJpa;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_product")
public class ProductJpa extends BaseEntityJpa {
    @Column(name = "c_name", nullable = false, unique = true)
    private String name;
    @Column(name = "c_code", nullable = false, unique = true)
    private String code;
    @Enumerated(EnumType.STRING)
    @Column(name = "c_type", nullable = false)
    private ProductTypeJpa type;
    @Column(name = "c_rate", nullable = false)
    private Double rate;
    @Column(name = "c_amount")
    private BigDecimal amount;
    @Column(name = "c_currency")
    private String currency;
    @Column(name = "c_description")
    private String description;
    @Column(name = "c_active", nullable = false)
    private Boolean active;
    @ManyToOne
    @JoinColumn(name = "c_category_id", nullable = false)
    private ProductCategoryJpa category;
}
