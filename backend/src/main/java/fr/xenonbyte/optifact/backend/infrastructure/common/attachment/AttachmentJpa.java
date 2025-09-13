package fr.xenonbyte.optifact.backend.infrastructure.common.attachment;

import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import fr.xenonbyte.optifact.backend.infrastructure.common.attachmenttype.AttachmentTypeJpa;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.UUID;

/**
 * Attachment JPA entity.
 */
@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_attachment")
public class AttachmentJpa extends BaseEntityJpa {

    @Column(name = "c_filename")
    private String filename;

    @Column(name = "c_mime_type")
    private String mimeType;

    @ManyToOne
    @JoinColumn(name = "c_attachment_type_id", nullable = false)
    private AttachmentTypeJpa attachmentType;

    @Enumerated(EnumType.STRING)
    @Column(name = "c_type", nullable = false)
    private AttachmentScopeJpa type;

    @Column(name = "c_resource_id")
    private UUID resourceId;

    @Column(name = "c_resource_name")
    private String resourceName;

    @Column(name = "c_created_by_id")
    private UUID createdById;
}
