package fr.xenonbyte.optifact.backend.infrastructure.common.setting;

import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.Address;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.Company;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.Contact;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.MailServerState;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.MailServerType;
import fr.xenonbyte.optifact.backend.domain.common.vo.BankAccount;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ObjectFactory;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Mapper
public interface SettingMapperJpa {

    @Mapping(target = "company", expression = "java(toCompanyEmbeddable(setting.getCompany()))")
    @Mapping(target = "emailServer", expression = "java(toEmailServerEmbeddable(setting.getEmailServer()))")
    SettingJpa toJpa(Setting setting);

    @ObjectFactory
    default Setting toDomain(SettingJpa jpa) {
        if (jpa == null) return null;
        Company company = toCompany(jpa.getCompany());
        EmailServer emailServer = toEmailServer(jpa.getEmailServer());
        return new Setting(jpa.getId(), company, emailServer);
    }

    // Helpers mapping VO -> Embeddable
    default CompanyEmbeddableJpa toCompanyEmbeddable(Company company) {
        if (company == null) return null;
        return CompanyEmbeddableJpa.builder()
                .name(company.getName())
                .logoFilename(company.getLogoFilename())
                .presidentId(company.getPresidentId())
                .bankAccount(toBankAccountEmbeddable(company.getBankAccount()))
                .address(toAddressEmbeddable(company.getAddress()))
                .contact(toContactEmbeddable(company.getContact()))
                .build();
    }

    default EmailServerEmbeddableJpa toEmailServerEmbeddable(EmailServer emailServer) {
        if (emailServer == null) return null;
        return EmailServerEmbeddableJpa.builder()
                .from(emailServer.getFrom())
                .type(emailServer.getType())
                .host(emailServer.getHost())
                .port(emailServer.getPort())
                .protocol(emailServer.getProtocol())
                .useTLS(emailServer.getUseTLS())
                .useAuth(emailServer.getUseAuth())
                .username(emailServer.getUsername())
                .password(emailServer.getPassword())
                .state(emailServer.getState())
                .confirmedAt(emailServer.getConfirmedAt())
                .build();
    }

    default AddressEmbeddableJpa toAddressEmbeddable(Address address) {
        if (address == null) return null;
        return AddressEmbeddableJpa.builder()
                .street(address.getStreet())
                .city(address.getCity())
                .country(address.getCountry())
                .zipCode(address.getZipCode())
                .website(address.getWebsite())
                .build();
    }

    default ContactEmbeddableJpa toContactEmbeddable(Contact contact) {
        if (contact == null) return null;
        return ContactEmbeddableJpa.builder()
                .name(contact.getName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .function(contact.getFunction())
                .build();
    }

    default BankAccountEmbeddableJpa toBankAccountEmbeddable(BankAccount bankAccount) {
        if (bankAccount == null) return null;
        return BankAccountEmbeddableJpa.builder()
                .bankAccountOwner(bankAccount.getBankAccountOwner())
                .bankName(bankAccount.getBankName())
                .bankCode(bankAccount.getBankCode())
                .bankCounter(bankAccount.getBankCounter())
                .bankAccountNumber(bankAccount.getBankAccountNumber())
                .bankAccountKey(bankAccount.getBankAccountKey())
                .build();
    }

    // Helpers mapping Embeddable -> VO
    default Company toCompany(CompanyEmbeddableJpa company) {
        if (company == null) return null;
        return Company.with(
                company.getName(),
                company.getLogoFilename(),
                company.getPresidentId(),
                toBankAccount(company.getBankAccount()),
                toAddress(company.getAddress()),
                toContact(company.getContact())
        );
    }

    default EmailServer toEmailServer(EmailServerEmbeddableJpa emailServer) {
        if (emailServer == null) return null;
        MailServerType type = emailServer.getType();
        MailServerState state = emailServer.getState();
        return EmailServer.with(
                emailServer.getFrom(),
                type,
                emailServer.getHost(),
                emailServer.getPort(),
                emailServer.getProtocol(),
                emailServer.getUseTLS(),
                emailServer.getUseAuth(),
                emailServer.getUsername(),
                emailServer.getPassword(),
                state,
                emailServer.getConfirmedAt()
        );
    }

    default Address toAddress(AddressEmbeddableJpa address) {
        if (address == null) return null;
        return Address.with(
                address.getStreet(),
                address.getCity(),
                address.getCountry(),
                address.getZipCode(),
                address.getWebsite()
        );
    }

    default Contact toContact(ContactEmbeddableJpa contact) {
        if (contact == null) return null;
        return Contact.with(
                contact.getName(),
                contact.getEmail(),
                contact.getPhone(),
                contact.getFunction()
        );
    }

    default BankAccount toBankAccount(BankAccountEmbeddableJpa bankAccount) {
        if (bankAccount == null) return null;
        return new BankAccount(
                bankAccount.getBankAccountOwner(),
                bankAccount.getBankName(),
                bankAccount.getBankCode(),
                bankAccount.getBankCounter(),
                bankAccount.getBankAccountNumber(),
                bankAccount.getBankAccountKey()
        );
    }
}
