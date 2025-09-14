package fr.xenonbyte.optifact.backend.application.common.attachment.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface UploadAttachmentUseCase {
    void uploadFile(Attachment attachment, String resourceName, String mimeType, String filename, String rootDirectory, byte[] contents);
}
