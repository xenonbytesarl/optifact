package fr.xenonbyte.optifact.backend.api.common.setting;

import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.api.common.setting.generated.SettingsApi;
import fr.xenonbyte.optifact.backend.api.common.setting.generated.view.SettingApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.setting.generated.view.SettingApiResponseView;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.Locale;
import java.util.UUID;

import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.CONTENT;
import static java.util.Map.of;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class SettingResource implements SettingsApi {

    private final SettingAdapterView adapterView;

    public SettingResource(SettingAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<SettingApiResponseView> findSettingById(String acceptLanguage, UUID settingId) {
        return ResponseEntity.status(OK).body(
                new SettingApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(SettingMessageView.SETTING_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findById(settingId)))
        );
    }

    @Override
    public ResponseEntity<SettingApiResponseView> updateSetting(String acceptLanguage, UUID settingId, SettingApiRequestView settingApiRequestView) {
        return ResponseEntity.status(OK).body(
                new SettingApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(SettingMessageView.SETTING_UPDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.update(settingId, settingApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<SettingApiResponseView> validateMailServer(String acceptLanguage, UUID settingId, String code) {
        return ResponseEntity.status(OK).body(
                new SettingApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(SettingMessageView.SETTING_MAIL_SERVER_VALIDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.validateMailServer(settingId, code)))
        );
    }

    @Override
    public ResponseEntity<SettingApiResponseView> verifyMailServer(String acceptLanguage, UUID settingId) {
        return ResponseEntity.status(OK).body(
                new SettingApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(SettingMessageView.SETTING_MAIL_SERVER_VERIFIED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.verifyMailServer(settingId)))
        );
    }

    @Override
    public ResponseEntity<SettingApiResponseView> findFirstSetting(String acceptLanguage) {
        return ResponseEntity.status(OK).body(
                new SettingApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(SettingMessageView.SETTING_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findFirst()))
        );
    }

}
