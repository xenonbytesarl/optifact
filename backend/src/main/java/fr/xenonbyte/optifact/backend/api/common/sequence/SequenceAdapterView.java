package fr.xenonbyte.optifact.backend.api.common.sequence;

import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.SequenceApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.SequencePageResponseView;
import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.SequenceResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.CreateSequencePrimaryPort;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.DeleteSequenceByIdPrimaryPort;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.FindSequenceByCodePrimaryPort;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.FindSequenceByIdPrimaryPort;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.SearchSequencesPrimaryPort;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.primary.UpdateSequencePrimaryPort;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public class SequenceAdapterView {

    private final CreateSequencePrimaryPort createUseCase;
    private final UpdateSequencePrimaryPort updateUseCase;
    private final FindSequenceByIdPrimaryPort findByIdUseCase;
    private final FindSequenceByCodePrimaryPort findByCodeUseCase;
    private final DeleteSequenceByIdPrimaryPort deleteByIdUseCase;
    private final SearchSequencesPrimaryPort searchUseCase;
    private final SequenceMapperView mapper;

    public SequenceAdapterView(CreateSequencePrimaryPort createUseCase,
                               UpdateSequencePrimaryPort updateUseCase,
                               FindSequenceByIdPrimaryPort findByIdUseCase,
                               FindSequenceByCodePrimaryPort findByCodeUseCase,
                               DeleteSequenceByIdPrimaryPort deleteByIdUseCase,
                               SearchSequencesPrimaryPort searchUseCase,
                               SequenceMapperView mapper) {
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.findByIdUseCase = findByIdUseCase;
        this.findByCodeUseCase = findByCodeUseCase;
        this.deleteByIdUseCase = deleteByIdUseCase;
        this.searchUseCase = searchUseCase;
        this.mapper = mapper;
    }

    public SequenceResponseView createSequence(SequenceApiRequestView request) {
        return mapper.toResponseView(createUseCase.createSequence(mapper.toDomain(request)));
    }

    public SequenceResponseView updateSequence(UUID sequenceId, SequenceApiRequestView request) {
        return mapper.toResponseView(updateUseCase.updateSequence(sequenceId, mapper.toDomain(request)));
    }

    public SequenceResponseView findSequenceById(UUID sequenceId) {
        return mapper.toResponseView(findByIdUseCase.findSequenceById(sequenceId));
    }

    public SequenceResponseView findSequenceByCode(String code) {
        return mapper.toResponseView(findByCodeUseCase.findSequenceByCode(code));
    }

    public void deleteSequenceById(UUID sequenceId) {
        deleteByIdUseCase.deleteSequenceById(sequenceId);
    }

    public SequencePageResponseView searchSequences(String nameFilter,
                                                    String codeFilter,
                                                    String prefixFilter,
                                                    String suffixFilter,
                                                    Integer page,
                                                    Integer size,
                                                    String sortField,
                                                    String sortDirection) {
        long safePage = page == null ? 0L : page.longValue();
        long safeSize = size == null ? 20L : size.longValue();
        String safeSort = (sortField == null || sortField.isBlank()) ? "id" : sortField;
        Direction safeDirection;
        if (sortDirection == null) {
            safeDirection = Direction.ASC;
        } else {
            try {
                safeDirection = Direction.valueOf(sortDirection.trim().toUpperCase());
            } catch (IllegalArgumentException ex) {
                safeDirection = Direction.ASC;
            }
        }
        return mapper.toResponsePageView(searchUseCase.searchSequences(
                nameFilter, codeFilter, prefixFilter, suffixFilter,
                new CommonSearch(safePage, safeSize, safeSort, safeDirection)));
    }
}
