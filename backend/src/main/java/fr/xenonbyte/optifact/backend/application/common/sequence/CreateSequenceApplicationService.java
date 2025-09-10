package fr.xenonbyte.optifact.backend.application.common.sequence;

import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceCodeConflictException;
import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceNameConflictException;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.CreateSequencePrimaryPort;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepositorySecondaryPort;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;

import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 10/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class CreateSequenceApplicationService implements CreateSequencePrimaryPort {

    public static final Logger LOGGER = Logger.getLogger(CreateSequenceApplicationService.class.getName());

    private final SequenceRepositorySecondaryPort repository;

    public CreateSequenceApplicationService(SequenceRepositorySecondaryPort repository) {
        this.repository = repository;
    }

    @Override
    public Sequence createSequence(Sequence sequence) {
        LOGGER.info("Creating sequence...");

        String code = sequence.getCode();
        if (code != null && repository.existsByCode(code)) {
            throw new SequenceCodeConflictException(code);
        }

        String name = sequence.getName();
        if (name != null && repository.existsByName(name)) {
            throw new SequenceNameConflictException(name);
        }

        sequence = repository.save(sequence);
        LOGGER.info("Sequence created successfully with id: '" + sequence.getId() + "'");
        return sequence;
    }
}
