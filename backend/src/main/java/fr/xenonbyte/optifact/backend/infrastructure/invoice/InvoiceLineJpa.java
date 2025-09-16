package fr.xenonbyte.optifact.backend.infrastructure.invoice;

import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import fr.xenonbyte.optifact.backend.infrastructure.product.ProductJpa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_invoice_line")
public class InvoiceLineJpa extends BaseEntityJpa {

    @ManyToOne
    @JoinColumn(name = "c_product_id", nullable = false)
    private ProductJpa product;

    @Column(name = "c_name", nullable = false)
    private String name;

    @Column(name = "c_quantity", nullable = false)
    private Integer quantity;

    @Column(name = "c_unit_price", nullable = false)
    private BigDecimal unitPrice;

    @Column(name = "c_amount", nullable = false)
    private BigDecimal amount;

    @ManyToOne
    @JoinColumn(name = "c_invoice_id", nullable = false)
    private InvoiceJpa invoice;
}
