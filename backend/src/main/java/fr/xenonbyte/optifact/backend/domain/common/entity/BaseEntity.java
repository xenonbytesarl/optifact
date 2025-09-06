package fr.xenonbyte.optifact.backend.domain.common.entity;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.time.ZonedDateTime;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public abstract class BaseEntity {
    protected UUID id;
    protected ZonedDateTime createdAt;
    protected ZonedDateTime updatedAt;

    public BaseEntity() {
        this.createdAt = ZonedDateTime.now();
        this.updatedAt = null;
    }

    protected void updateAudit(ZonedDateTime createdAt) {
        this.updatedAt = ZonedDateTime.now();
        this.createdAt = createdAt;
    }

    protected void updateAudit(ZonedDateTime createdAt, ZonedDateTime updatedAt) {
        this.updatedAt = updatedAt;
        this.createdAt = createdAt;
    }

    public UUID getId() {
        return id;
    }

    public ZonedDateTime getCreatedAt() {
        return createdAt;
    }

    public ZonedDateTime getUpdatedAt() {
        return updatedAt;
    }


}
