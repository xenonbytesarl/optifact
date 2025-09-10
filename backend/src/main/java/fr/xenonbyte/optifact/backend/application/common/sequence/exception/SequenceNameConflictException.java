package fr.xenonbyte.optifact.backend.application.common.sequence.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.domain.common.sequence.message.SequenceMessage;

/**
 * @author bamk
 * @version 1.0
 * @since 10/09/2025
 */
public final class SequenceNameConflictException extends ConflictException {
    public SequenceNameConflictException(String name) {
        super(SequenceMessage.SEQUENCE_NAME_CONFLICT, name);
    }
}
