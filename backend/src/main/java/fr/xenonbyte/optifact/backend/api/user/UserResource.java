package fr.xenonbyte.optifact.backend.api.user;

import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.api.user.generated.AuthApi;
import fr.xenonbyte.optifact.backend.api.user.generated.UsersApi;
import fr.xenonbyte.optifact.backend.api.user.generated.view.CreateUserPasswordRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.RegisterUserApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.RolePageApiResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserApiResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserPageApiResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginRequest;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginSuccessResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.LoginResponse;
import fr.xenonbyte.optifact.backend.application.user.port.in.LoginUserUseCase;
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
public class UserResource implements UsersApi, AuthApi {

    private final UserAdapterView adapterView;
    private final LoginUserUseCase loginUserUseCase;

    public UserResource(UserAdapterView adapterView, LoginUserUseCase loginUserUseCase) {
        this.adapterView = adapterView;
        this.loginUserUseCase = loginUserUseCase;
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
    public ResponseEntity<Void> createUserPassword(String acceptLanguage, UUID id, String code, CreateUserPasswordRequestView createUserPasswordRequestView) {
        adapterView.createUserPassword(id, code, createUserPasswordRequestView);
        return ResponseEntity.noContent().build();
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
    public ResponseEntity<Void> registerUser(String acceptLanguage, RegisterUserApiRequestView registerUserApiRequestView) {
        adapterView.registerUser(registerUserApiRequestView);
        return ResponseEntity.status(CREATED).build();
    }

    @Override
    public ResponseEntity<UserPageApiResponseView> searchUsers(String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String nameFilter, String emailFilter, String phoneFilter, String roleNameFilter) {
        return ResponseEntity.status(OK).body(
                new UserPageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(UserMessageView.USERS_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchUsers(nameFilter, emailFilter, phoneFilter, roleNameFilter, page, size, sortField, sortDirection)))
        );
    }
    
    @Override
    public ResponseEntity<UserApiResponseView> updateUser(String acceptLanguage, UUID id, UserApiRequestView userApiRequestView) {
        return ResponseEntity.status(OK).body(
                new UserApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(UserMessageView.USER_UPDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.updateUser(id, userApiRequestView)))
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

    @Override
    public ResponseEntity<LoginSuccessResponse> login(String acceptLanguage, LoginRequest loginRequest) {
        LoginResponse response = loginUserUseCase.login(loginRequest.getUsername(), loginRequest.getPassword());
        LoginSuccessResponse body = new LoginSuccessResponse(response.getAccessToken(), response.getRefreshToken());
        return ResponseEntity.ok(body);
    }
}
