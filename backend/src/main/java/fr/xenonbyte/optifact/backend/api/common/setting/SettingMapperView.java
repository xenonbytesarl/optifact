package fr.xenonbyte.optifact.backend.api.common.setting;

import fr.xenonbyte.optifact.backend.api.common.setting.generated.view.*;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.Address;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.Company;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.Contact;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.MailServerState;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.MailServerType;
import fr.xenonbyte.optifact.backend.domain.common.vo.BankAccount;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

import java.time.ZonedDateTime;
import java.util.UUID;

@Mapper
public interface SettingMapperView {

    // API -> Domain
    default Setting toDomain(SettingApiRequestView requestView, UUID id) {
        return new Setting(
                id,
                toCompany(requestView.getCompany()),
                toEmailServer(requestView.getEmailServer())
        );
    }

    // Domain -> API
    default SettingResponseView toResponseView(Setting setting) {
        SettingResponseView resp = new SettingResponseView();
        resp.setId(setting.getId());
        if (setting.getCompany() != null) {
            resp.setCompany(toCompanyResponse(setting.getCompany()));
        }
        if (setting.getEmailServer() != null) {
            resp.setEmailServer(toEmailServerResponse(setting.getEmailServer()));
        }
        return resp;
    }

    // Company mapping
    default Company toCompany(CompanyRequestView view) {
        if (view == null) return null;
        return Company.with(
                view.getName(),
                view.getLogoFilename(),
                view.getPresidentId(),
                toBankAccount(view.getBankAccount()),
                toAddress(view.getAddress()),
                toContact(view.getContact())
        );
    }

    default CompanyResponseView toCompanyResponse(Company company) {
        CompanyResponseView view = new CompanyResponseView();
        view.setName(company.getName());
        view.setLogoFilename(company.getLogoFilename());
        view.setPresidentId(company.getPresidentId());
        view.setBankAccount(toBankAccountView(company.getBankAccount()));
        view.setAddress(toAddressView(company.getAddress()));
        view.setContact(toContactView(company.getContact()));
        return view;
    }

    // Address mapping
    default Address toAddress(AddressView view) {
        if (view == null) return null;
        return Address.with(view.getStreet(), view.getCity(), view.getCountry(), view.getZipCode(), view.getWebsite());
    }

    default AddressView toAddressView(Address address) {
        if (address == null) return null;
        AddressView v = new AddressView();
        v.setStreet(address.getStreet());
        v.setCity(address.getCity());
        v.setCountry(address.getCountry());
        v.setZipCode(address.getZipCode());
        v.setWebsite(address.getWebsite());
        return v;
    }

    // Contact mapping
    default Contact toContact(ContactView view) {
        if (view == null) return null;
        return Contact.with(view.getName(), view.getEmail(), view.getPhone(), view.getFunction());
    }

    default ContactView toContactView(Contact contact) {
        if (contact == null) return null;
        ContactView v = new ContactView();
        v.setName(contact.getName());
        v.setEmail(contact.getEmail());
        v.setPhone(contact.getPhone());
        v.setFunction(contact.getFunction());
        return v;
    }

    // Bank account mapping
    default BankAccount toBankAccount(BankAccountView view) {
        if (view == null) return null;
        return BankAccount.create(
                view.getBankAccountOwner(),
                view.getBankName(),
                view.getBankCode(),
                view.getBankCounter(),
                view.getBankAccountNumber(),
                view.getBankAccountKey()
        );
    }

    default BankAccountView toBankAccountView(BankAccount account) {
        if (account == null) return null;
        BankAccountView v = new BankAccountView();
        v.setBankAccountOwner(account.getBankAccountOwner());
        v.setBankName(account.getBankName());
        v.setBankCode(account.getBankCode());
        v.setBankCounter(account.getBankCounter());
        v.setBankAccountNumber(account.getBankAccountNumber());
        v.setBankAccountKey(account.getBankAccountKey());
        return v;
    }

    // Email server mapping
    default EmailServer toEmailServer(EmailServerRequestView view) {
        if (view == null) return null;
        return EmailServer.with(
                view.getFrom(),
                view.getType() == null ? null : MailServerType.valueOf(view.getType().name()),
                view.getHost(),
                view.getPort(),
                view.getProtocol(),
                view.getUseTLS(),
                view.getUseAuth(),
                view.getUsername(),
                view.getPassword(),
                view.getState() == null ? null : MailServerState.valueOf(view.getState().name()),
                view.getConfirmedAt() == null ? null : view.getConfirmedAt().toZonedDateTime()
        );
    }

    default EmailServerResponseView toEmailServerResponse(EmailServer server) {
        if (server == null) return null;
        EmailServerResponseView v = new EmailServerResponseView();
        v.setFrom(server.getFrom());
        v.setType(server.getType() == null ? null : MailServerTypeView.valueOf(server.getType().name()));
        v.setHost(server.getHost());
        v.setPort(server.getPort());
        v.setProtocol(server.getProtocol());
        v.setUseTLS(server.getUseTLS());
        v.setUseAuth(server.getUseAuth());
        v.setUsername(server.getUsername());
        // Do not expose password
        v.setState(server.getState() == null ? null : MailServerStateView.valueOf(server.getState().name()));
        v.setConfirmedAt(server.getConfirmedAt() == null ? null : server.getConfirmedAt().toOffsetDateTime());
        return v;
    }

    // Factory for domain creation if needed
    @ObjectFactory
    default Setting createSetting(UUID id, SettingApiRequestView request) {
        return toDomain(request, id);
    }
}
