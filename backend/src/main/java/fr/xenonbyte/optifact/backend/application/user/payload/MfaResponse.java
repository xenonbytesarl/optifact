package fr.xenonbyte.optifact.backend.application.user.payload;

/**
 * @author bamk
 * @version 1.0
 * @since 23/09/2025
 */
public class MfaResponse implements AuthResponse {
    private final boolean mfaEnabled;
    private final String email;

    public MfaResponse(boolean mfaEnabled, String email) {
        this.mfaEnabled = mfaEnabled;
        this.email = email;
    }

    public boolean isMfaEnabled() {
        return mfaEnabled;
    }

    public String getEmail() {
        return email;
    }

}
