package fr.xenonbyte.optifact.backend.domain.user.message;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
public final class UserMessage {



    private UserMessage() {}

    public static final String PRIVILEGE_NAME_REQUIRED = "privilege.name.required";


    public static final String ROLE_CODE_REQUIRED = "role.code.required";
    public static final String ROLE_NAME_REQUIRED = "role.name.required";
    public static final String ROLE_CODE_NOT_FOUND = "role.code.not.found";
    public static final String ROLE_PRIVILEGES_REQUIRED = "role.privileges.required";

    public static final String USER_LASTNAME_REQUIRED = "user.lastname.required";
    public static final String USER_EMAIL_REQUIRED = "user.email.required";
    public static final String USER_PASSWORD_REQUIRED = "user.password.required";
    public static final String USER_ROLE_REQUIRED = "user.roles.required";
    public static final String USER_ID_NOT_FOUND = "user.id.not.found";
    public static final String USER_EMAIL_CONFLICT = "user.email.conflict";
    public static final String USER_EMAIL_NOT_FOUND = "user.email.not.found";
    public static final String USER_PASSWORD_AND_CONFIRM_NOT_MATCH = "user.password.and.confirm.not.matched";
    public static final String USER_ACCOUNT_ALREADY_ENABLED = "user.account.already.enabled";
}
