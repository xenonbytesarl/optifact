package fr.xenonbyte.optifact.backend.application.common.sequence.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.domain.common.sequence.message.SequenceMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 10/09/2025
 */
public final class SequenceCodeConflictException extends ConflictException {
    public SequenceCodeConflictException(String code) {
        super(SequenceMessage.SEQUENCE_CODE_CONFLICT, code);
    }
}
