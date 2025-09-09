package fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.message.AttachmentTypeMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
public final class AttachmentTypeNameConflictException extends ConflictException {
    public AttachmentTypeNameConflictException(String name) {
        super(AttachmentTypeMessage.ATTACHMENT_TYPE_NAME_CONFLICT, name);
    }
}
