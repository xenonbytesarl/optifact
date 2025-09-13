package fr.xenonbyte.optifact.backend.application.common.sequence;

import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.SearchSequencesPrimaryPort;
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
public final class SearchSequenceApplicationService implements SearchSequencesPrimaryPort {

    public static final Logger LOGGER = Logger.getLogger(SearchSequenceApplicationService.class.getName());

    private final SequenceRepository repository;

    public SearchSequenceApplicationService(SequenceRepository repository) {
        this.repository = repository;
    }

    @Override
    public Pagination<Sequence> searchSequences(String nameFilter, String codeFilter, String prefixFilter, String suffixFilter, CommonSearch search) {
        LOGGER.info("Searching sequences with nameFilter: '" + nameFilter + "', codeFilter: '" + codeFilter
                + "', prefixFilter: '" + prefixFilter + "', suffixFilter: '" + suffixFilter + "'" );

        Pagination<Sequence> sequencesPage = repository.search(nameFilter, codeFilter, prefixFilter, suffixFilter, search);

        LOGGER.info("Found " + sequencesPage.elements().size() + " sequences (total: " + sequencesPage.totalElements() + ")");

        return sequencesPage;
    }
}
