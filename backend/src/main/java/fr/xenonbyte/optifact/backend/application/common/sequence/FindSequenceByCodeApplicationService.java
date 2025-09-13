package fr.xenonbyte.optifact.backend.application.common.sequence;

import fr.xenonbyte.optifact.backend.application.common.sequence.exception.SequenceCodeNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.FindSequenceByCodePrimaryPort;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepository;
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
public final class FindSequenceByCodeApplicationService implements FindSequenceByCodePrimaryPort {

    public static final Logger LOGGER = Logger.getLogger(FindSequenceByCodeApplicationService.class.getName());

    private final SequenceRepository repository;

    public FindSequenceByCodeApplicationService(SequenceRepository repository) {
        this.repository = repository;
    }

    @Override
    public Sequence findSequenceByCode(String code) {
        LOGGER.info("Find sequence with code: '" + code + "'" );

        Sequence sequence = repository.findByCode(code)
                .orElseThrow(() -> new SequenceCodeNotFoundException(code));

        LOGGER.info("Sequence found successfully with code: '" + code + "'" );
        return sequence;
    }
}
