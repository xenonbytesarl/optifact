package fr.xenonbyte.optifact.backend.infrastructure.common.sequence;

import fr.xenonbyte.optifact.backend.domain.common.sequence.Sequence;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

@Mapper
public interface SequenceMapperJpa {


    SequenceJpa toJpa(Sequence sequence);

   Sequence toDomain(SequenceJpa sequenceJpa);

   @ObjectFactory
    default Sequence createSequence(SequenceJpa sequenceJpa) {
       return Sequence.create(
               sequenceJpa.getId(),
               sequenceJpa.getCode(),
               sequenceJpa.getName(),
               sequenceJpa.getStep(),
               sequenceJpa.getSize(),
               sequenceJpa.getNext(),
               sequenceJpa.getPrefix(),
               sequenceJpa.getSuffix(),
               sequenceJpa.getActive()
       );
   }
}
