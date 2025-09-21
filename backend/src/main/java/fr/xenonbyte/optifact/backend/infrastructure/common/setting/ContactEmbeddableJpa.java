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
public class ContactEmbeddableJpa {
    @Column(name = "c_contact_name")
    private String name;
    @Column(name = "c_contact_email")
    private String email;
    @Column(name = "c_contact_phone")
    private String phone;
    @Column(name = "c_contact_function")
    private String function;
}
