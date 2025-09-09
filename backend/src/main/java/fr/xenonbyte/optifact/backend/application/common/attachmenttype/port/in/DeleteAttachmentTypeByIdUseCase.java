package fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface DeleteAttachmentTypeByIdUseCase {
    void deleteAttachmentTypeById(UUID attachmentTypeId);
}
