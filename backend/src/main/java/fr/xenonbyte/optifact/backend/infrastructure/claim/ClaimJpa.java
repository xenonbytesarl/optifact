package fr.xenonbyte.optifact.backend.infrastructure.claim;

import fr.xenonbyte.optifact.backend.infrastructure.actor.ActorJpa;
import fr.xenonbyte.optifact.backend.infrastructure.common.BaseEntityJpa;
import fr.xenonbyte.optifact.backend.infrastructure.product.ProductJpa;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@Entity
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "t_claim")
public class ClaimJpa extends BaseEntityJpa {

    @ManyToOne
    @JoinColumn(name = "c_actor_id", nullable = false)
    private ActorJpa actor;

    @ManyToOne
    @JoinColumn(name = "c_product_id", nullable = false)
    private ProductJpa product;

    @Column(name = "c_submit_at")
    private ZonedDateTime submitAt;

    @Column(name = "c_manager_id")
    private UUID managerId;

    @Column(name = "c_in_instruction_at")
    private ZonedDateTime inInstructionAt;

    @Column(name = "c_instructor_id")
    private UUID instructorId;

    @Column(name = "c_validate_at")
    private ZonedDateTime validateAt;

    @Column(name = "c_reject_at")
    private ZonedDateTime rejectAt;

    @Column(name = "c_done_by_id")
    private UUID doneById;

    @Column(name = "c_done_at")
    private ZonedDateTime doneAt;

    @Column(name = "c_cancel_by_id")
    private UUID cancelById;

    @Column(name = "c_cancel_at")
    private ZonedDateTime cancelAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "c_state", nullable = false)
    private ClaimStateJpa state;

    @Column(name = "c_reference", nullable = false, unique = true)
    private String reference;

    @OneToMany(mappedBy = "claim", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ClaimLineJpa> lines;
}
