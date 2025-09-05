package fr.xenonbyte.optifact.backend.infrastructure.common;

import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.MappedSuperclass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.ZonedDateTime;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Getter
@Setter
@SuperBuilder
@MappedSuperclass
@NoArgsConstructor
@AllArgsConstructor
public abstract class BaseEntityJpa {

    @Id
    @Column(name = "c_id", nullable = false, unique = true)
    protected UUID id;
    @Column(name = "c_created_at",  updatable = false, nullable = false)
    protected ZonedDateTime createdAt;
    @Column(name = "c_updated_at", insertable = false)
    protected ZonedDateTime updatedAt;
}