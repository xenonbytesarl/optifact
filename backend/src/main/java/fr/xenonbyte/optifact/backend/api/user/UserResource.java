package fr.xenonbyte.optifact.backend.api.user;

import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.api.user.generated.UsersApi;
import fr.xenonbyte.optifact.backend.api.user.generated.view.ApiSuccessResponse;
import fr.xenonbyte.optifact.backend.api.user.generated.view.CreateUserPasswordRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginApiResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.LoginSuccessResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.RegisterUserApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.RolePageApiResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserApiRequestView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserApiResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.UserPageApiResponseView;
import fr.xenonbyte.optifact.backend.api.user.generated.view.VerifyMfaCodeApiRequestView;
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
public class UserResource implements UsersApi {

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
    public ResponseEntity<ApiSuccessResponse> createUserPassword(String acceptLanguage, UUID id, String code, CreateUserPasswordRequestView createUserPasswordRequestView) {
        adapterView.createUserPassword(id, code, createUserPasswordRequestView);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(UserMessageView.USER_PASSWORD_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
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
    public ResponseEntity<LoginApiResponseView> login(String acceptLanguage, LoginApiRequestView loginApiRequestView) {
        LoginResponseView responseView = adapterView.login(loginApiRequestView);
        return ResponseEntity.status(OK).body(
                new LoginApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(responseView instanceof LoginSuccessResponseView ? UserMessageView.USER_LOGGED_SUCCESSFULLY : UserMessageView.USER_MFA_VERIFICATION_CODE_SEND, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, responseView))
        );
    }

    @Override
    public ResponseEntity<ApiSuccessResponse> registerUser(String acceptLanguage, RegisterUserApiRequestView registerUserApiRequestView) {
        adapterView.registerUser(registerUserApiRequestView);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(UserMessageView.USER_REGISTERED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
        );
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
    public ResponseEntity<LoginApiResponseView> verifyMfaCode(String acceptLanguage, VerifyMfaCodeApiRequestView verifyMfaCodeApiRequestView) {

        return ResponseEntity.status(OK).body(
                new LoginApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(UserMessageView.USER_LOGGED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.verifyMfaCode(verifyMfaCodeApiRequestView)))
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
