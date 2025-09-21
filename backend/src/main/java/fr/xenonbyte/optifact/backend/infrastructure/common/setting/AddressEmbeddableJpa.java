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
public class AddressEmbeddableJpa {
    @Column(name = "c_address_street")
    private String street;
    @Column(name = "c_address_city")
    private String city;
    @Column(name = "c_address_country")
    private String country;
    @Column(name = "c_address_zip_code")
    private String zipCode;
    @Column(name = "c_address_website")
    private String website;
}
