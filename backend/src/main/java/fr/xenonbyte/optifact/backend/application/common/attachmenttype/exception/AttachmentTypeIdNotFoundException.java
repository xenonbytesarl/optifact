package fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.message.AttachmentTypeMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
public final class AttachmentTypeIdNotFoundException extends NotFoundException {
    public AttachmentTypeIdNotFoundException(UUID id) {
        super(AttachmentTypeMessage.ATTACHMENT_TYPE_ID_NOT_FOUND, id);
    }
}
