package fr.xenonbyte.optifact.backend.application.common.attachment.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.common.attachment.message.AttachmentMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
public final class AttachmentIdNotFoundException extends NotFoundException {
    public AttachmentIdNotFoundException(UUID attachmentId) {
        super(AttachmentMessage.ATTACHMENT_ID_NOT_FOUND, attachmentId);
    }
}
