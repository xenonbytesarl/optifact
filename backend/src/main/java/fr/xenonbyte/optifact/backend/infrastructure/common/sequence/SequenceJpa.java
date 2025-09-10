package fr.xenonbyte.optifact.backend.infrastructure.common.sequence;

import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.math.BigInteger;

/**
 * JPA entity for Sequence
 */
@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_sequence")
public class SequenceJpa extends BaseEntityJpa {

    @Column(name = "c_name", nullable = false)
    private String name;

    @Column(name = "c_code", nullable = false)
    private String code;

    @Column(name = "c_step", nullable = false)
    private Long step;

    @Column(name = "c_size", nullable = false)
    private Long size;

    @Column(name = "c_next", nullable = false)
    private BigInteger next;

    @Column(name = "c_prefix")
    private String prefix;

    @Column(name = "c_suffix")
    private String suffix;

    @Column(name = "c_active", nullable = false)
    private Boolean active;
}
