package fr.xenonbyte.optifact.backend.infrastructure.verification;

import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationState;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

@Mapper
public interface VerificationMapperJpa {

    @Mapping(target = "type", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.verification.VerificationTypeJpa.valueOf(verification.getType().name()))")
    @Mapping(target = "status", expression = "java(fr.xenonbyte.optifact.backend.infrastructure.verification.VerificationStateJpa.valueOf(verification.getStatus().name()))")
    VerificationJpa toJpa(Verification verification);

    Verification toDomain(VerificationJpa jpa);

    @ObjectFactory
    default Verification createVerification(VerificationJpa jpa) {
        return new Verification(
                jpa.getId(),
                jpa.getCode(),
                jpa.getUserId(),
                jpa.getServerId(),
                VerificationType.valueOf(jpa.getType().name()),
                jpa.getExpiredAt(),
                VerificationState.valueOf(jpa.getStatus().name()),
                jpa.getVerifiedAt(),
                jpa.getCancelledAt()
        );
    }
}
