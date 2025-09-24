package fr.xenonbyte.optifact.backend.api.common.setting;

import fr.xenonbyte.optifact.backend.api.common.setting.generated.view.SettingApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.setting.generated.view.SettingResponseView;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.CreateSettingEmailServerPasswordUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindFirstSettingUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindSettingByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.UpdateSettingUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.ValidateMailServerUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.VerifyMailServerUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.UUID;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public final class SettingAdapterView {

    private final FindSettingByIdUseCase findUseCase;
    private final UpdateSettingUseCase updateUseCase;
    private final SettingMapperView mapperView;
    private final FindFirstSettingUseCase findFirstUseCase;
    private final VerifyMailServerUseCase verifyMailServerUseCase;
    private final ValidateMailServerUseCase validateMailServerUseCase;
    private final CreateSettingEmailServerPasswordUseCase createMailServerPasswordUseCase;

    public SettingAdapterView(FindSettingByIdUseCase findUseCase,
                              UpdateSettingUseCase updateUseCase,
                              SettingMapperView mapperView,
                              FindFirstSettingUseCase findFirstUseCase,
                              VerifyMailServerUseCase verifyMailServerUseCase,
                              ValidateMailServerUseCase validateMailServerUseCase,
                              CreateSettingEmailServerPasswordUseCase createMailServerPasswordUseCase) {
        this.findUseCase = findUseCase;
        this.updateUseCase = updateUseCase;
        this.mapperView = mapperView;
        this.findFirstUseCase = findFirstUseCase;
        this.verifyMailServerUseCase = verifyMailServerUseCase;
        this.validateMailServerUseCase = validateMailServerUseCase;
        this.createMailServerPasswordUseCase = createMailServerPasswordUseCase;
    }

    public SettingResponseView findById(UUID id) {
        return mapperView.toResponseView(findUseCase.findSettingById(id));
    }

    public SettingResponseView findFirst() {
        return mapperView.toResponseView(findFirstUseCase.findFirstSetting());
    }

    public SettingResponseView update(UUID id, SettingApiRequestView request) {
        return mapperView.toResponseView(updateUseCase.updateSetting(id, mapperView.toDomain(request, id)));
    }

    public SettingResponseView verifyMailServer(UUID settingId) {
        return mapperView.toResponseView(verifyMailServerUseCase.verifyMailServer(settingId));
    }

    public SettingResponseView validateMailServer(UUID settingId, String code) {
        return mapperView.toResponseView(validateMailServerUseCase.validateMailServer(settingId, code));
    }

    public SettingResponseView createEmailServerPassword(UUID settingId, String password) {
        return mapperView.toResponseView(createMailServerPasswordUseCase.createSettingEmailServerPassword(settingId, password));
    }
}
