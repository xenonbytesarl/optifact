package fr.xenonbyte.optifact.backend.domain.claim;

import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import static java.util.UUID.randomUUID;

@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Claim extends BaseEntity {

    private final UUID actorId;
    private final UUID productId;
    private final ZonedDateTime submitAt;
    private final UUID managerId;
    private final ZonedDateTime inInstructionAt;
    private final UUID instructorId;
    private final ZonedDateTime validateAt;
    private final ZonedDateTime rejectAt;
    private final UUID doneById;
    private final ZonedDateTime doneAt;
    private final UUID cancelById;
    private final ZonedDateTime cancelAt;
    private final ClaimState state;
    private final String reference;
    private final List<ClaimLine> lines;

    public Claim(UUID id, UUID actorId, UUID productId, ZonedDateTime submitAt, UUID managerId, ZonedDateTime inInstructionAt,
                 UUID instructorId, ZonedDateTime validateAt, ZonedDateTime rejectAt, UUID doneById, ZonedDateTime doneAt,
                 UUID cancelById, ZonedDateTime cancelAt, ClaimState state, String reference, List<ClaimLine> lines) {
        this.id = id;
        this.actorId = actorId;
        this.productId = productId;
        this.submitAt = submitAt;
        this.managerId = managerId;
        this.inInstructionAt = inInstructionAt;
        this.instructorId = instructorId;
        this.validateAt = validateAt;
        this.rejectAt = rejectAt;
        this.doneById = doneById;
        this.doneAt = doneAt;
        this.cancelById = cancelById;
        this.cancelAt = cancelAt;
        this.state = state;
        this.reference = reference;
        this.lines = lines;
    }

    public static Claim create(UUID actorId,
                               UUID productId,
                               ZonedDateTime submitAt,
                               UUID managerId,
                               ZonedDateTime inInstructionAt,
                               UUID instructorId,
                               ZonedDateTime validateAt,
                               ZonedDateTime rejectAt,
                               UUID doneById,
                               ZonedDateTime doneAt,
                               UUID cancelById,
                               ZonedDateTime cancelAt,
                               ClaimState state,
                               String reference,
                               List<ClaimLine> lines) {
        validateParams(actorId, productId);
        UUID id = randomUUID();
        lines = addClaimToClaimLine(lines, id);
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,
                inInstructionAt,
                instructorId,
                validateAt,
                rejectAt,
                doneById,
                doneAt,
                cancelById,
                cancelAt,
                state,
                reference,
                lines
        );
    }

    private static void validateParams(UUID actorId, UUID productId) {
        if(actorId == null) {
            throw new IllegalArgumentException(ClaimMessage.CLAIM_ACTOR_ID_REQUIRED);
        }
        if(productId == null) {
            throw new IllegalArgumentException(ClaimMessage.CLAIM_PRODUCT_ID_REQUIRED);
        }
    }

    private static List<ClaimLine> addClaimToClaimLine(List<ClaimLine> lines, UUID id) {
        lines = lines.stream().map(line -> line.withClaimId(id)).toList();
        return lines;
    }

    public static Claim create(UUID id,
                               UUID actorId,
                               UUID productId,
                               ZonedDateTime submitAt,
                               UUID managerId,
                               ZonedDateTime inInstructionAt,
                               UUID instructorId,
                               ZonedDateTime validateAt,
                               ZonedDateTime rejectAt,
                               UUID doneById,
                               ZonedDateTime doneAt,
                               UUID cancelById,
                               ZonedDateTime cancelAt,
                               ClaimState state,
                               String reference,
                               List<ClaimLine> lines) {
        validateParams(actorId, productId);
        lines = addClaimToClaimLine(lines, id);
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,
                inInstructionAt,
                instructorId,
                validateAt,
                rejectAt,
                doneById,
                doneAt,
                cancelById,
                cancelAt,
                state,
                reference,
                lines
        );
    }

    public Claim update(
            UUID actorId,
            UUID productId,
            ZonedDateTime submitAt,
            UUID managerId,
            ZonedDateTime inInstructionAt,
            UUID instructorId,
            ZonedDateTime validateAt,
            ZonedDateTime rejectAt,
            UUID doneById,
            ZonedDateTime doneAt,
            UUID cancelById,
            ZonedDateTime cancelAt,
            ClaimState state,
            String reference,
            List<ClaimLine> lines
    ) {
        validateParams(actorId, productId);
        lines = addClaimToClaimLine(lines, id);
        Claim claim = new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,
                inInstructionAt,
                instructorId,
                validateAt,
                rejectAt,
                doneById,
                doneAt,
                cancelById,
                cancelAt,
                state,
                reference,
                lines
        );
        claim.updateAudit(createdAt);
        return claim;

    }

    public Claim withLines(List<ClaimLine> lines) {
        return new Claim(
            id,
            actorId,
            productId,
            submitAt,
            managerId,
            inInstructionAt,
            instructorId,
            validateAt,
            rejectAt,
            doneById,
            doneAt,
            cancelById,
            cancelAt,
            state,
            reference,
            lines
        );
    }


    public Claim withValidate(UUID instructorId, ZonedDateTime validateAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,
                inInstructionAt,
                instructorId,
                validateAt,
                rejectAt,
                doneById,
                doneAt,
                cancelById,
                cancelAt,
                ClaimState.VALIDATED,
                reference,
                lines
        );
    }

    public Claim withReject(UUID instructorId, ZonedDateTime rejectAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,
                inInstructionAt,
                instructorId,
                validateAt,
                rejectAt,
                doneById,
                doneAt,
                cancelById,
                cancelAt,
                ClaimState.REJECT,
                reference,
                lines
        );
    }

    public Claim withSubmit(ZonedDateTime submitAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,
                inInstructionAt,
                instructorId,
                validateAt,
                rejectAt,
                doneById,
                doneAt,
                cancelById,
                cancelAt,
                ClaimState.SUBMIT,
                reference,
                lines
        );
    }

    public Claim withCancel(UUID cancelById, ZonedDateTime cancelAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,
                inInstructionAt,
                instructorId,
                validateAt,
                rejectAt,
                doneById,
                doneAt,
                cancelById,
                cancelAt,
                ClaimState.CANCELLED,
                reference,
                lines
        );
    }

    public Claim withDone(UUID doneById, ZonedDateTime doneAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,
                inInstructionAt,
                instructorId,
                validateAt,
                rejectAt,
                doneById,
                doneAt,
                cancelById,
                cancelAt,
                ClaimState.DONE,
                reference,
                lines
        );
    }

    public Claim withInInstruction(UUID managerId, ZonedDateTime inInstructionAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,
                inInstructionAt,
                instructorId,
                validateAt,
                rejectAt,
                doneById,
                doneAt,
                cancelById,
                cancelAt,
                ClaimState.IN_INSTRUCTION,
                reference,
                lines
        );
    }

    public UUID getActorId() {
        return actorId;
    }

    public UUID getProductId() {
        return productId;
    }

    public ZonedDateTime getSubmitAt() {
        return submitAt;
    }

    public UUID getManagerId() {
        return managerId;
    }

    public ZonedDateTime getInInstructionAt() {
        return inInstructionAt;
    }

    public UUID getInstructorId() {
        return instructorId;
    }

    public ZonedDateTime getValidateAt() {
        return validateAt;
    }

    public ZonedDateTime getRejectAt() {
        return rejectAt;
    }

    public UUID getDoneById() {
        return doneById;
    }

    public ZonedDateTime getDoneAt() {
        return doneAt;
    }

    public UUID getCancelById() {
        return cancelById;
    }

    public ZonedDateTime getCancelAt() {
        return cancelAt;
    }

    public ClaimState getState() {
        return state;
    }

    public String getReference() {
        return reference;
    }

    public List<ClaimLine> getLines() {
        return lines;
    }
}
