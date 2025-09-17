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
    private final UUID managerQuoteId;
    private final UUID managerCompliantId;
    private final ZonedDateTime compliantAt;
    private final ZonedDateTime inInstructionAt;
    private final UUID instructorId;
    private final ZonedDateTime instructionDoneAt;
    private final ZonedDateTime instructionRejectedAt;
    private final UUID agreementById;
    private final ZonedDateTime agreementGrantedAt;
    private final ZonedDateTime agreementRefusedAt;
    private final ZonedDateTime agreementAdjournedAt;
    private final UUID cancelById;
    private final ZonedDateTime cancelAt;
    private final ClaimState state;
    private final String reference;
    private final List<ClaimLine> lines;

    public Claim(UUID id, UUID actorId, UUID productId, ZonedDateTime submitAt, UUID managerQuoteId, UUID managerCompliantId, ZonedDateTime compliantAt,
                 ZonedDateTime inInstructionAt, UUID instructorId, ZonedDateTime instructionDoneAt, ZonedDateTime instructionRejectedAt, UUID agreementById,
                 ZonedDateTime agreementGrantedAt, ZonedDateTime agreementRefusedAt, ZonedDateTime agreementAdjournedAt,
                 UUID cancelById, ZonedDateTime cancelAt, ClaimState state, String reference, List<ClaimLine> lines) {
        
        this.id = id;
        this.actorId = actorId;
        this.productId = productId;
        this.submitAt = submitAt;
        this.managerQuoteId = managerQuoteId;
        this.inInstructionAt = inInstructionAt;
        this.instructorId = instructorId;
        this.instructionDoneAt = instructionDoneAt;
        this.instructionRejectedAt = instructionRejectedAt;
        this.managerCompliantId = managerCompliantId;
        this.compliantAt = compliantAt;
        this.agreementById = agreementById;
        this.agreementGrantedAt = agreementGrantedAt;
        this.agreementRefusedAt = agreementRefusedAt;
        this.agreementAdjournedAt = agreementAdjournedAt;
        this.cancelById = cancelById;
        this.cancelAt = cancelAt;
        this.state = state;
        this.reference = reference;
        this.lines = lines;
    }

    public static Claim create(UUID actorId,
                               UUID productId,
                               ZonedDateTime submitAt,
                               UUID managerQuoteId,
                               UUID managerCompliantId, 
                               ZonedDateTime compliantAt,
                               ZonedDateTime inInstructionAt,
                               UUID instructorId,
                               ZonedDateTime instructionDoneAt,
                               ZonedDateTime instructionRejectedAt,
                               UUID agreementById,
                               ZonedDateTime agreementGrantedAt,
                               ZonedDateTime agreementRefusedAt,
                               ZonedDateTime agreementAdjournedAt,
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
                managerQuoteId, 
                managerCompliantId, 
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt,
                state,
                reference, lines);
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
                               UUID managerQuoteId,
                               UUID managerCompliantId,
                               ZonedDateTime compliantAt,
                               ZonedDateTime inInstructionAt,
                               UUID instructorId,
                               ZonedDateTime instructionDoneAt,
                               ZonedDateTime instructionRejectedAt,
                               UUID agreementById,
                               ZonedDateTime agreementGrantedAt,
                               ZonedDateTime agreementRefusedAt,
                               ZonedDateTime agreementAdjournedAt,
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
                managerQuoteId, 
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt,
                state,
                reference, lines);
    }

    public Claim update(
            UUID actorId,
            UUID productId,
            ZonedDateTime submitAt,
            UUID managerQuoteId,
            UUID managerCompliantId,
            ZonedDateTime compliantAt,
            ZonedDateTime inInstructionAt,
            UUID instructorId,
            ZonedDateTime instructionDoneAt,
            ZonedDateTime instructionRejectedAt,
            UUID agreementById,
            ZonedDateTime agreementGrantedAt,
            ZonedDateTime agreementRefusedAt,
            ZonedDateTime agreementAdjournedAt,
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
                managerQuoteId, 
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt,
                state,
                reference, lines);
        claim.updateAudit(createdAt);
        return claim;

    }

    public Claim withLines(List<ClaimLine> lines) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt,
                state, reference, lines != null ? lines : new ArrayList<>());
    }


    public Claim withInstructionDone(UUID instructorId, ZonedDateTime instructionDoneAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt,
                ClaimState.INSTRUCTION_DONE,
                reference, lines);
    }

    public Claim withInstructionRejected(UUID instructorId, ZonedDateTime instructionRejectedAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, ClaimState.INSTRUCTION_REJECTED, reference, lines);
    }

    public Claim withSubmit(ZonedDateTime submitAt) {
        if(inInstructionAt != null) {
            return new Claim(
                    id,
                    actorId,
                    productId,
                    submitAt,
                    managerQuoteId,
                    managerCompliantId,
                    compliantAt,
                    inInstructionAt,
                    instructorId,
                    instructionDoneAt,
                    instructionRejectedAt,
                    agreementById,
                    agreementGrantedAt,
                    agreementRefusedAt,
                    agreementAdjournedAt,
                    cancelById,
                    cancelAt,
                    ClaimState.IN_INSTRUCTION,
                    reference, lines);
        }
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, ClaimState.SUBMITTED,
                reference, lines);
    }

    public Claim withCancel(UUID cancelById, ZonedDateTime cancelAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, ClaimState.CANCELLED, reference, lines);
    }

    public Claim withAgreementGranted(ZonedDateTime agreementGrantedAt, UUID agreementById) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, ClaimState.AGREEMENT_GRANTED, reference, lines);
    }

    public Claim withAgreementRefused(ZonedDateTime agreementRefusedAt, UUID agreementById) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, ClaimState.AGREEMENT_REFUSED, reference, lines);
    }

    public Claim withAgreementAdjourn(ZonedDateTime agreementAdjournedAt, UUID agreementById) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, ClaimState.AGREEMENT_ADJOURNED, reference, lines);
    }

    public Claim withInInstruction(UUID managerId, ZonedDateTime inInstructionAt) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerId,  
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, ClaimState.IN_INSTRUCTION, reference, lines);
    }

    public Claim withReference(String reference) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, state, reference, lines);
    }

    public Claim withDraft() {
        List<ClaimLine> transformedLines = lines.stream()
                .map(line -> {
                    if (line.isRejected()) {
                        return line.withDraft();
                    }
                    return line;
                })
                .toList();
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, ClaimState.DRAFT, reference, transformedLines);
    }

    public Claim withCompleteCompliance(ZonedDateTime compliantAt, UUID managerCompliantId) {
        return new Claim(
                id,
                actorId,
                productId,
                submitAt,
                managerQuoteId,
                managerCompliantId,
                compliantAt,
                inInstructionAt,
                instructorId,
                instructionDoneAt,
                instructionRejectedAt,
                agreementById,
                agreementGrantedAt,
                agreementRefusedAt,
                agreementAdjournedAt,
                cancelById,
                cancelAt, ClaimState.COMPLETE_COMPLIANT, reference, lines);
    }

    public boolean isInstructionRejected() {
        return state == ClaimState.INSTRUCTION_REJECTED;
    }

    public boolean isInstructionDone() {
        return state == ClaimState.INSTRUCTION_DONE;
    }

    public boolean isCompleteCompliant() {
        return state == ClaimState.COMPLETE_COMPLIANT;
    }

    public boolean isUploadStarted() {
        return lines.stream().anyMatch(ClaimLine::isUploadStarted);
    }

    public boolean isUploadEnded() {
        return lines.stream().allMatch(ClaimLine::isUploadStarted);
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

    public UUID getManagerQuoteId() {
        return managerQuoteId;
    }

    public ZonedDateTime getInInstructionAt() {
        return inInstructionAt;
    }

    public UUID getInstructorId() {
        return instructorId;
    }

    public ZonedDateTime getInstructionDoneAt() {
        return instructionDoneAt;
    }

    public ZonedDateTime getInstructionRejectedAt() {
        return instructionRejectedAt;
    }

    public UUID getAgreementById() {
        return agreementById;
    }

    public ZonedDateTime getAgreementGrantedAt() {
        return agreementGrantedAt;
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

    public ZonedDateTime getAgreementRefusedAt() {
        return agreementRefusedAt;
    }

    public ZonedDateTime getAgreementAdjournedAt() {
        return agreementAdjournedAt;
    }

    public UUID getManagerCompliantId() {
        return managerCompliantId;
    }

    public ZonedDateTime getCompliantAt() {
        return compliantAt;
    }
}
