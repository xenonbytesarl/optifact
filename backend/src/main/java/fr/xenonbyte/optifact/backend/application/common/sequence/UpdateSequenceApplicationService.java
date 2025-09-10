package fr.xenonbyte.optifact.backend.application.common.sequence;

import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceCodeConflictException;
import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceNameConflictException;
import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.UpdateSequencePrimaryPort;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepositorySecondaryPort;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 10/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class UpdateSequenceApplicationService implements UpdateSequencePrimaryPort {

    public static final Logger LOGGER = Logger.getLogger(UpdateSequenceApplicationService.class.getName());

    private final SequenceRepositorySecondaryPort repository;

    public UpdateSequenceApplicationService(SequenceRepositorySecondaryPort repository) {
        this.repository = repository;
    }

    @Override
    public Sequence updateSequence(UUID sequenceId, Sequence sequence) {
        LOGGER.info("Updating sequence...");

        Sequence existing = repository.findById(sequenceId)
                .orElseThrow(() -> new SequenceIdNotFoundException(sequenceId));


        String code = sequence.getCode();
        if (code != null && repository.existsByCodeExcludingId(code, sequenceId)) {
            throw new SequenceCodeConflictException(code);
        }

        String name = sequence.getName();
        if (name != null && repository.existsByNameExcludingId(name, sequenceId)) {
            throw new SequenceNameConflictException(name);
        }

        existing = existing.update(
                sequence.getName(),
                sequence.getCode(),
                sequence.getStep(),
                sequence.getSize(),
                sequence.getNext(),
                sequence.getPrefix(),
                sequence.getSuffix(),
                sequence.getActive()
        );

        sequence = repository.save(existing);
        LOGGER.info("Sequence updated successfully with id: '" + sequence.getId() + "'");
        return sequence;
    }
}
