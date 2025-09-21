package fr.xenonbyte.optifact.backend.infrastructure.common.setting;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
public class BankAccountEmbeddableJpa {
    @Column(name = "c_bank_account_owner")
    private String bankAccountOwner;
    @Column(name = "c_bank_name")
    private String bankName;
    @Column(name = "c_bank_code")
    private String bankCode;
    @Column(name = "c_bank_counter")
    private String bankCounter;
    @Column(name = "c_bank_account_number")
    private String bankAccountNumber;
    @Column(name = "c_bank_account_key")
    private String bankAccountKey;
}
