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
    public static final String ROLE_PRIVILEGES_REQUIRED = "role.privileges.required";

    public static final String USER_LASTNAME_REQUIRED = "user.lastname.required";
    public static final String USER_EMAIL_REQUIRED = "user.email.required";
    public static final String USER_PASSWORD_REQUIRED = "user.password.required";
}