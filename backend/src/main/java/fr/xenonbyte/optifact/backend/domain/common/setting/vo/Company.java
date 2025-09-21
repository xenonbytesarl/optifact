package fr.xenonbyte.optifact.backend.domain.common.setting.vo;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.vo.BankAccount;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 20/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.VALUE_OBJECT)
@Hexagonal.ValueObject
public final class Company {

    private static final String COMPANY_NAME_REQUIRED = "company.name.required";

    private final String name;
    private final String logoFilename;
    private final UUID presidentId;
    private final BankAccount bankAccount;
    private final Address address;
    private final Contact contact;

    public Company(String name, String logoFilename, UUID presidentId, BankAccount bankAccount, Address address, Contact contact) {
        this.name = name;
        this.logoFilename = logoFilename;
        this.presidentId = presidentId;
        this.bankAccount = bankAccount;
        this.address = address;
        this.contact = contact;
    }

    public static Company with(String name, String logoFilename, UUID presidentId, BankAccount bankAccount, Address address, Contact contact) {
        if(name == null || name.isBlank()) {
            throw new IllegalArgumentException(COMPANY_NAME_REQUIRED);
        }
        return new Company(name, logoFilename, presidentId, bankAccount, address, contact);
    }

    public Company withPresidentId(UUID presidentId) {
        return new Company(name, logoFilename, presidentId, bankAccount, address, contact);
    }

    public Company withLogoFilename(String logoFilename) {
        return new Company(name, logoFilename, presidentId, bankAccount, address, contact);
    }

    public Company withBankAccount(BankAccount bankAccount) {
        return new Company(name, logoFilename, presidentId, bankAccount, address, contact);
    }

    public Company withAddress(Address address) {
        return new Company(name, logoFilename, presidentId, bankAccount, address, contact);
    }

    public Company withContact(Contact contact) {
        return new Company(name, logoFilename, presidentId, bankAccount, address, contact);
    }

    public String getName() {
        return name;
    }

    public String getLogoFilename() {
        return logoFilename;
    }

    public UUID getPresidentId() {
        return presidentId;
    }

    public BankAccount getBankAccount() {
        return bankAccount;
    }

    public Address getAddress() {
        return address;
    }

    public Contact getContact() {
        return contact;
    }
}
