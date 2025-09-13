package fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;

import java.util.Optional;
import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.SecondaryPort
public interface SequenceRepository {

    Sequence save(Sequence sequence);

    boolean existsByCode(String code);

    boolean existsByName(String name);

    boolean existsByCodeExcludingId(String code, UUID sequenceId);

    boolean existsByNameExcludingId(String name, UUID sequenceId);

    Optional<Sequence> findById(UUID sequenceId);

    Optional<Sequence> findByCode(String code);

    Optional<Sequence> findByName(String name);

    Pagination<Sequence> search(String nameFilter, String codeFilter, String prefixFilter, String suffixFilter, CommonSearch commonSearch);

    void delete(Sequence sequence);

    boolean existById(UUID sequenceId);

}