package fr.xenonbyte.optifact.backend.api.user;

import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.api.user.generated.UsersApi;
import fr.xenonbyte.optifact.backend.api.user.generated.view.RolePageApiResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserApiResponseView;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.Locale;
import java.util.UUID;

import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.CONTENT;
import static java.util.Map.of;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class UserResource implements UsersApi {

    private final UserAdapterView adapterView;

    public UserResource(UserAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<UserApiResponseView> createUser(String acceptLanguage, UserApiRequestView userApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new UserApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(CREATED.name())
                        .message(MessageUtil.getMessage(UserMessageView.USER_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.createUser(userApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<UserApiResponseView> findUserByEmail(String acceptLanguage, String email) {
        return ResponseEntity.status(OK).body(
                new UserApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(UserMessageView.USER_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findUserByEmail(email)))
        );
    }

    @Override
    public ResponseEntity<UserApiResponseView> findUserById(String acceptLanguage, UUID id) {
        return ResponseEntity.status(OK).body(
                new UserApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(UserMessageView.USER_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findUserById(id)))
        );
    }

    @Override
    public ResponseEntity<RolePageApiResponseView> findRoles(String acceptLanguage) {
        return ResponseEntity.status(OK).body(
                new RolePageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(UserMessageView.ROLES_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findRoles()))
        );
    }
}
