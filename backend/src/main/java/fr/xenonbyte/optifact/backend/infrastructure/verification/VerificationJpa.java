package fr.xenonbyte.optifact.backend.infrastructure.verification;

import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import fr.xenonbyte.optifact.backend.infrastructure.user.UserJpa;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.ZonedDateTime;
import java.util.UUID;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_verification")
public class VerificationJpa extends BaseEntityJpa {

    @Column(name = "c_code", nullable = false, unique = true)
    private String code;

    @Column(name = "c_server_id")
    private UUID serverId;

    @Enumerated(EnumType.STRING)
    @Column(name = "c_type", nullable = false)
    private VerificationTypeJpa type;

    @Column(name = "c_expired_at")
    private ZonedDateTime expiredAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "c_status", nullable = false)
    private VerificationStateJpa status;

    @Column(name = "c_verified_at")
    private ZonedDateTime verifiedAt;

    @Column(name = "c_cancelled_at")
    private ZonedDateTime cancelledAt;

    @ManyToOne
    @JoinColumn(name = "c_user_id")
    private UserJpa user;
}
