package fr.xenonbyte.optifact.backend.api.common.setting;

import fr.xenonbyte.optifact.backend.api.common.setting.generated.view.SettingApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.setting.generated.view.SettingResponseView;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindSettingByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.UpdateSettingUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public final class SettingAdapterView {

    private final FindSettingByIdUseCase findUseCase;
    private final UpdateSettingUseCase updateUseCase;
    private final SettingMapperView mapperView;

    public SettingAdapterView(FindSettingByIdUseCase findUseCase, UpdateSettingUseCase updateUseCase, SettingMapperView mapperView) {
        this.findUseCase = findUseCase;
        this.updateUseCase = updateUseCase;
        this.mapperView = mapperView;
    }

    public SettingResponseView findById(UUID id) {
        return mapperView.toResponseView(findUseCase.findSettingById(id));
    }

    public SettingResponseView update(UUID id, SettingApiRequestView request) {
        return mapperView.toResponseView(updateUseCase.updateSetting(id, mapperView.toDomain(request, id)));
    }
}
