package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.user.payload.AuthResponse;
import fr.xenonbyte.optifact.backend.application.user.payload.LoginResponse;
import fr.xenonbyte.optifact.backend.application.user.port.in.FindUserByEmailUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.in.VerifyMfaUserCodeUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.TokenProvider;
import fr.xenonbyte.optifact.backend.application.verification.port.in.VerifiedVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;

import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class VerifyMfaUserCodeApplicationService implements VerifyMfaUserCodeUseCase {

    private static final Logger LOGGER = Logger.getLogger(VerifyMfaUserCodeApplicationService.class.getName());

    private final FindUserByEmailUseCase findUserByEmailUseCase;
    private final TokenProvider tokenProvider;
    private final VerifiedVerificationUseCase verifiedVerificationUseCase;

    public VerifyMfaUserCodeApplicationService(
            FindUserByEmailUseCase findUserByEmailUseCase,
            TokenProvider tokenProvider,
            VerifiedVerificationUseCase verifiedVerificationUseCase) {
        this.findUserByEmailUseCase = findUserByEmailUseCase;
        this.tokenProvider = tokenProvider;
        this.verifiedVerificationUseCase = verifiedVerificationUseCase;
    }

    @Override
    public AuthResponse verifyMfaCode(String email, String code) {
        LOGGER.info("Verifying MFA code for email: '" + email + "'");

        User user  = findUserByEmailUseCase.findByEmail(email);

        verifiedVerificationUseCase.verifyUserCode(user.getId(), code);

        String accessToken = tokenProvider.generateAccessToken(user);
        String refreshToken = tokenProvider.generateRefreshToken(user);
        LOGGER.info("User logged successfully with email: '" + email + "'");
        return new LoginResponse(accessToken, refreshToken);
    }


}
