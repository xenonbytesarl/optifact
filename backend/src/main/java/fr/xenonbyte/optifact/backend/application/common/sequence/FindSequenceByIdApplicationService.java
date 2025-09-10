package fr.xenonbyte.optifact.backend.application.common.sequence;

import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceIdNotFoundException;
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
public final class FindSequenceByIdApplicationService implements FindSequenceByIdPrimaryPort {

    public static final Logger LOGGER = Logger.getLogger(FindSequenceByIdApplicationService.class.getName());

    private final SequenceRepositorySecondaryPort repository;

    public FindSequenceByIdApplicationService(SequenceRepositorySecondaryPort repository) {
        this.repository = repository;
    }

    @Override
    public Sequence findSequenceById(UUID sequenceId) {
        LOGGER.info("Find sequence with id: '" + sequenceId + "'" );

        Sequence sequence = repository.findById(sequenceId)
                .orElseThrow(() -> new SequenceIdNotFoundException(sequenceId));

        LOGGER.info("Sequence found successfully with id: '" + sequenceId + "'" );
        return sequence;
    }
}
