package fr.xenonbyte.optifact.backend.application.common.sequence.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.common.sequence.message.SequenceMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 10/09/2025
 */
public final class SequenceIdNotFoundException extends NotFoundException {
    public SequenceIdNotFoundException(UUID sequenceId) {
        super(SequenceMessage.SEQUENCE_ID_NOT_FOUND, sequenceId);
    }
}
