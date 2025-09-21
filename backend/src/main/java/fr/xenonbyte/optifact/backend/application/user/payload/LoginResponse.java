package fr.xenonbyte.optifact.backend.application.user.payload;

/**
 * @author bamk
 * @version 1.0
 * @since 23/09/2025
 */
public class LoginResponse extends AuthResponse {
    private final String accessToken;
    private final String refreshToken;

    public LoginResponse(String accessToken, String refreshToken) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

}
