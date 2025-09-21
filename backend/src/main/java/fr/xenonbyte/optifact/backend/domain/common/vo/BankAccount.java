package fr.xenonbyte.optifact.backend.domain.common.vo;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.vo.message.BankAccountMessage;

/**
 * Value object for bank account information used on an invoice.
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.ValueObject
public final class BankAccount {
    private final String bankAccountOwner;
    private final String bankName;
    private final String bankCode;
    private final String bankCounter;
    private final String bankAccountNumber;
    private final String bankAccountKey;

    public BankAccount(String bankAccountOwner,
                       String bankName,
                       String bankCode,
                       String bankCounter,
                       String bankAccountNumber,
                       String bankAccountKey) {
        this.bankAccountOwner = bankAccountOwner.trim();
        this.bankName = bankName.trim();
        this.bankCode = bankCode.trim();
        this.bankCounter = bankCounter.trim();
        this.bankAccountNumber = bankAccountNumber.trim();
        this.bankAccountKey = bankAccountKey.trim();
    }

    public static BankAccount create(
            String bankAccountOwner,
            String bankName,
            String bankCode,
            String bankCounter,
            String bankAccountNumber,
            String bankAccountKey
    ) {
        //validateParams(bankAccountOwner, bankName, bankCode, bankCounter, bankAccountNumber, bankAccountKey);
        return new BankAccount(bankAccountOwner, bankName, bankCode, bankCounter, bankAccountNumber, bankAccountKey);
    }

    private static void validateParams(
            String bankAccountOwner,
            String bankName,
            String bankCode,
            String bankCounter,
            String bankAccountNumber,
            String bankAccountKey
    ) {
        validateRequired(bankAccountOwner, BankAccountMessage.BANK_ACCOUNT_OWNER_REQUIRED);
        validateRequired(bankName, BankAccountMessage.BANK_NAME_REQUIRED);
        validateRequired(bankCode, BankAccountMessage.BANK_CODE_REQUIRED);
        validateRequired(bankCounter, BankAccountMessage.BANK_COUNTER_REQUIRED);
        validateRequired(bankAccountNumber, BankAccountMessage.BANK_ACCOUNT_NUMBER_REQUIRED);
        validateRequired(bankAccountKey, BankAccountMessage.BANK_ACCOUNT_KEY_REQUIRED);
    }

    private static void validateRequired(String value, String message) {
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(message);
        }
    }

    public String getBankAccountOwner() {
        return bankAccountOwner;
    }

    public String getBankName() {
        return bankName;
    }

    public String getBankCode() {
        return bankCode;
    }

    public String getBankCounter() {
        return bankCounter;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public String getBankAccountKey() {
        return bankAccountKey;
    }
}
