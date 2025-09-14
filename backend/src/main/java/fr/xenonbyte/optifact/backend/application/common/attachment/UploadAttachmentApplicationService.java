package fr.xenonbyte.optifact.backend.application.common.attachment;

import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.UploadAttachmentUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.out.AttachmentRepository;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.file.port.SaveFileUsecase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;

import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class UploadAttachmentApplicationService implements UploadAttachmentUseCase {

    private static final Logger LOGGER = Logger.getLogger(UploadAttachmentApplicationService.class.getName());

    private final AttachmentRepository repository;
    private final SaveFileUsecase saveFileUsecase;


    public UploadAttachmentApplicationService(AttachmentRepository repository, SaveFileUsecase saveFileUsecase) {
        this.repository = repository;
        this.saveFileUsecase = saveFileUsecase;
    }

    @Override
    public void uploadFile(Attachment attachment, String resourceName, String mimeType, String filename, String rootDirectory, byte[] contents) {
        LOGGER.info(String.format("Uploading file %s to %s", filename, rootDirectory));

        Attachment existing = repository.findById(attachment.getId()).orElseThrow(
                () -> new AttachmentTypeIdNotFoundException(attachment.getId())
        );

        String filenameWithFullPtah = saveFileUsecase.save(contents, rootDirectory, filename);

        existing = existing.update(
                filenameWithFullPtah,
                mimeType,
                existing.getAttachmentTypeId(),
                existing.getScope(),
                existing.getResourceId(),
                resourceName
        );

        repository.save(existing);

        LOGGER.info(String.format("File %s uploaded successfully to %s", filename, rootDirectory));
    }
}
