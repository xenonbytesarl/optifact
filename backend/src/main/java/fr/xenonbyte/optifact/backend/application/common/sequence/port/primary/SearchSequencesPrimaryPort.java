package fr.xenonbyte.optifact.backend.application.common.sequence.port.primary;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface SearchSequencesPrimaryPort {

    Pagination<Sequence> searchSequences(String nameFilter, String codeFilter, String prefixFilter, String suffixFilter, CommonSearch search);
}
