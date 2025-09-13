package fr.xenonbyte.optifact.backend.application.common.attachment.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface FindAttachmentByIdUseCase {
    Attachment findAttachmentById(UUID attachmentId);
}
