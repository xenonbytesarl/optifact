package fr.xenonbyte.optifact.backend.api.common.sequence;

import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.SequenceApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.SequencePageResponseView;
import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.SequenceResponseView;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

import java.math.BigInteger;

@Mapper
public interface SequenceMapperView {

    Sequence toDomain(SequenceApiRequestView requestView);

    SequenceResponseView toResponseView(Sequence sequence);

    SequencePageResponseView toResponsePageView(Pagination<Sequence> page);

    @ObjectFactory
    default Sequence createSequence(SequenceApiRequestView request) {
        return Sequence.create(
                request.getCode(),
                request.getName(),
                request.getStep() == null ? null : request.getStep(),
                request.getSize() == null ? null : request.getSize(),
                request.getNext() == null ? null : new BigInteger(request.getNext()),
                request.getPrefix(),
                request.getSuffix(),
                request.getActive()
        );
    }
}
