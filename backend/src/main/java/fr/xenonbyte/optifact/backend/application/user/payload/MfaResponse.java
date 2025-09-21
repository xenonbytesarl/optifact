package fr.xenonbyte.optifact.backend.application.user.payload;

/**
 * @author bamk
 * @version 1.0
 * @since 23/09/2025
 */
public class MfaResponse extends AuthResponse {
    private final boolean mfaEnabled;

    public MfaResponse(boolean mfaEnabled) {
        this.mfaEnabled = mfaEnabled;
    }

    public boolean isMfaEnabled() {
        return mfaEnabled;
    }
}
