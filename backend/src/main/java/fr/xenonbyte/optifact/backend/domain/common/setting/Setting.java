package fr.xenonbyte.optifact.backend.domain.common.setting;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.Company;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.MailServerState;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class  Setting extends BaseEntity {

    public static final int DEFAULT_MAIL_SERVER_CODE_DURATION_LENGTH = 5;

    private static final String SETTING_COMPANY_REQUIRED = "setting.company.required";

    private final Company company;
    private final EmailServer emailServer;

    public Setting(UUID id, Company company, EmailServer emailServer) {
        this.id = id;
        this.company = company;
        this.emailServer = emailServer;
    }

    public Setting with(Company company, EmailServer emailServer) {
        if(company == null) throw new IllegalArgumentException(SETTING_COMPANY_REQUIRED);
        Setting setting = new Setting(this.id, company, this.emailServer.update(emailServer));
        setting.updateAudit(this.createdAt);
        return setting;
    }

    public Company getCompany() {
        return company;
    }

    public EmailServer getEmailServer() {
        return emailServer;
    }

    public Setting waitingMailServer() {
        return with(company, emailServer.withWaiting());
    }

    public boolean emailServerIsConfirmed() {
        return emailServer.getState().equals(MailServerState.CONFIRM);
    }

    public Setting confirmMailServer() {
        return with(company, emailServer.withConfirmed());
    }
}
