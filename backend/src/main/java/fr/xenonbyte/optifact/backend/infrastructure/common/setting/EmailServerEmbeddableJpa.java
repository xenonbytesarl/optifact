package fr.xenonbyte.optifact.backend.infrastructure.common.setting;

import fr.xenonbyte.optifact.backend.domain.common.setting.vo.MailServerState;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.MailServerType;
import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.ZonedDateTime;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Embeddable
public class EmailServerEmbeddableJpa {
    @Column(name = "c_mail_from")
    private String from;
    @Enumerated(EnumType.STRING)
    @Column(name = "c_mail_type")
    private MailServerType type;
    @Column(name = "c_mail_host")
    private String host;
    @Column(name = "c_mail_port")
    private Integer port;
    @Column(name = "c_mail_protocol")
    private String protocol;
    @Column(name = "c_mail_use_tls")
    private Boolean useTLS;
    @Column(name = "c_mail_use_auth")
    private Boolean useAuth;
    @Column(name = "c_mail_username")
    private String username;
    @Column(name = "c_mail_password")
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(name = "c_mail_state")
    private MailServerState state;
    @Column(name = "c_mail_confirmed_at")
    private ZonedDateTime confirmedAt;
}
