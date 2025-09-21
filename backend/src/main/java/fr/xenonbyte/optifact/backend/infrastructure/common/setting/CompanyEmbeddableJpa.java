package fr.xenonbyte.optifact.backend.infrastructure.common.setting;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import jakarta.persistence.Embedded;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.UUID;

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
public class CompanyEmbeddableJpa {
    @Column(name = "c_company_name", nullable = false)
    private String name;
    @Column(name = "c_company_logo_filename")
    private String logoFilename;
    @Column(name = "c_company_president_id")
    private UUID presidentId;

    @Embedded
    private BankAccountEmbeddableJpa bankAccount;

    @Embedded
    private AddressEmbeddableJpa address;

    @Embedded
    private ContactEmbeddableJpa contact;
}
