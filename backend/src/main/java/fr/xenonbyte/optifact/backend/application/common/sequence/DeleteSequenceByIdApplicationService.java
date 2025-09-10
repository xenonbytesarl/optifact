package fr.xenonbyte.optifact.backend.application.common.sequence;

import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.DeleteSequenceByIdPrimaryPort;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.FindSequenceByIdPrimaryPort;
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
public final class DeleteSequenceByIdApplicationService implements DeleteSequenceByIdPrimaryPort {

    public static final Logger LOGGER = Logger.getLogger(DeleteSequenceByIdApplicationService.class.getName());

    private final SequenceRepositorySecondaryPort repository;

    public DeleteSequenceByIdApplicationService(SequenceRepositorySecondaryPort repository) {
        this.repository = repository;
    }

    @Override
    public void deleteSequenceById(UUID sequenceId) {
        LOGGER.info("deleting sequence with id: '" + sequenceId + "'" );

        Sequence sequence = repository.findById(sequenceId)
                .orElseThrow(() -> new SequenceIdNotFoundException(sequenceId));

        repository.delete(sequence);

        LOGGER.info("Sequence with id: '" + sequenceId + "' deleted successfully");
    }
}
