package fr.xenonbyte.optifact.backend.infrastructure.verification;

import fr.xenonbyte.optifact.backend.application.verification.port.out.VerificationRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationStatus;
import fr.xenonbyte.optifact.backend.infrastructure.user.UserJpa;

import java.util.Optional;
import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public final class VerificationRepositoryAdapterJpa implements VerificationRepository {

    private final VerificationRepositoryJpa repositoryJpa;
    private final VerificationMapperJpa mapperJpa;

    public VerificationRepositoryAdapterJpa(VerificationRepositoryJpa repositoryJpa, VerificationMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }

    @Override
    public Optional<Verification> findByUserIdAndState(UUID userId, VerificationStatus status) {
        return repositoryJpa.findByUserAndStatus(
                    UserJpa.builder().id(userId).build(),
                    VerificationStateJpa.valueOf(status.name()))
                .map(mapperJpa::toDomain);
    }

    @Override
    public Optional<Verification> findByServerIdState(UUID serverId, VerificationStatus status) {
        return repositoryJpa.findByServerIdAndStatus(serverId, VerificationStateJpa.valueOf(status.name())).map(mapperJpa::toDomain);
    }

    @Override
    public Verification save(Verification verification) {
        return mapperJpa.toDomain(repositoryJpa.save(mapperJpa.toJpa(verification)));
    }

    @Override
    public Optional<Verification> findByCodeAndUserIdAndState(String code, UUID userId, VerificationStatus status) {
        return repositoryJpa.findByCodeAndUserAndStatus(
                        code,
                        UserJpa.builder().id(userId).build(),
                        VerificationStateJpa.valueOf(status.name()))
                .map(mapperJpa::toDomain);
    }

    @Override
    public Optional<Verification> findByCodeAndUserId(String code, UUID userId) {
        return repositoryJpa.findByCodeAndUser(code, UserJpa.builder().id(userId).build())
                .map(mapperJpa::toDomain);
    }

    @Override
    public Optional<Verification> findByCodeAndServerId(String code, UUID serverId) {
        return repositoryJpa.findByCodeAndServerId(code, serverId)
                .map(mapperJpa::toDomain);
    }

}
