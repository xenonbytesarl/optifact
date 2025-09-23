package fr.xenonbyte.optifact.backend.domain.verification;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;

import java.time.ZonedDateTime;
import java.util.UUID;
import java.security.SecureRandom;

import static java.util.UUID.randomUUID;


@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Verification extends BaseEntity {

    private final String code;
    private final UUID userId;
    private final UUID serverId;
    private final VerificationType type;
    private final ZonedDateTime expiredAt;
    private final VerificationStatus status;
    private final ZonedDateTime verifiedAt;
    private final ZonedDateTime cancelledAt;

    public Verification( UUID id,
                         String code,
                         UUID userId,
                         UUID serverId,
                         VerificationType type,
                         ZonedDateTime expiredAt,
                         VerificationStatus status,
                         ZonedDateTime verifiedAt,
                         ZonedDateTime cancelledAt) {
        this.id = id;
        this.code = code;
        this.userId = userId;
        this.serverId = serverId;
        this.type = type;
        this.expiredAt = expiredAt;
        this.status = status;
        this.verifiedAt = verifiedAt;
        this.cancelledAt = cancelledAt;
        }

    public static Verification create(UUID userId, UUID serverId, String code, VerificationType type, ZonedDateTime expiredAt) {
        return new Verification(
                randomUUID(),
                code,
                userId,
                serverId,
                type,
                expiredAt,
                VerificationStatus.PENDING,
                null,
                null
        );
    }

    public Verification create(
            UUID id,
            String code,
            UUID userId,
            UUID serverId,
            VerificationType type,
            VerificationStatus state,
            ZonedDateTime expiredAt,
            ZonedDateTime verifiedAt,
            ZonedDateTime cancelledAt) {
        return new Verification(id, code, userId, serverId, type, expiredAt, state, verifiedAt, cancelledAt);
    }

    public Verification withCode(String code) {
        return new Verification(id, code, this.userId, this.serverId, this.type, this.expiredAt,this.status, null, null);
    }

    public Verification verify() {
        return new Verification(id, this.code, this.userId, this.serverId, this.type, this.expiredAt, VerificationStatus.VERIFIED, ZonedDateTime.now(), null);
    }

    public Verification cancel() {
        return new Verification(this.id, this.code, this.userId, this.serverId, this.type, this.expiredAt, VerificationStatus.CANCEL, null, ZonedDateTime.now());
    }

    public String getCode() {
        return code;
    }

    public UUID getUserId() {
        return userId;
    }

    public UUID getServerId() {
        return serverId;
    }

    public VerificationType getType() {
        return type;
    }

    public ZonedDateTime getExpiredAt() {
        return expiredAt;
    }

    public VerificationStatus getStatus() {
        return status;
    }

    public ZonedDateTime getVerifiedAt() {
        return verifiedAt;
    }

    public ZonedDateTime getCancelledAt() {
        return cancelledAt;
    }


    public static String generateCode(int length, CodeType codeType) {
        if (length <= 0) {
            throw new IllegalArgumentException("length must be > 0");
        }
        final char[] digits = "0123456789".toCharArray();
        final char[] alphaNum = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".toCharArray();
        final char[] alphabet = codeType.equals(CodeType.ALPHANUMERIC) ? alphaNum : digits;
        SecureRandom rnd = new SecureRandom();
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(alphabet[rnd.nextInt(alphabet.length)]);
        }
        return sb.toString();
    }
}
