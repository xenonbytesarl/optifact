package fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.message.AttachmentTypeMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
public final class AttachmentTypeNameNotFoundException extends NotFoundException {
    public AttachmentTypeNameNotFoundException(String name) {
        super(AttachmentTypeMessage.ATTACHMENT_TYPE_NAME_NOT_FOUND, name);
    }
}
