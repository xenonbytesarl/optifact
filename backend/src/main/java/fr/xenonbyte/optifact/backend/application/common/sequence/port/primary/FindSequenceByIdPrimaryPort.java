package fr.xenonbyte.optifact.backend.application.common.sequence.port.primary;


import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;

import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface FindSequenceByIdPrimaryPort {

    Sequence findSequenceById(UUID sequenceId);
}
