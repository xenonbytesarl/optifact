package fr.xenonbyte.optifact.backend.infrastructure.common.setting;

import fr.xenonbyte.optifact.backend.application.common.setting.port.out.SettingRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;

import java.util.Optional;
import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public final class SettingRepositoryAdapterJpa implements SettingRepository {

    private final SettingRepositoryJpa repositoryJpa;
    private final SettingMapperJpa mapperJpa;

    public SettingRepositoryAdapterJpa(SettingRepositoryJpa repositoryJpa, SettingMapperJpa mapperJpa) {
        this.repositoryJpa = repositoryJpa;
        this.mapperJpa = mapperJpa;
    }

    @Override
    public Setting save(Setting setting) {
        return mapperJpa.toDomain(repositoryJpa.save(mapperJpa.toJpa(setting)));
    }

    @Override
    public Optional<Setting> findById(UUID settingId) {
        return repositoryJpa.findById(settingId).map(mapperJpa::toDomain);
    }

    @Override
    public boolean existById(UUID settingId) {
        return repositoryJpa.existsById(settingId);
    }
}
