package fr.xenonbyte.optifact.backend.domain.claim.message;

/**
 * @author bamk
 * @version 1.0
 * @since 13/09/2025
 */
public final class ClaimMessage {
    public static final String CLAIM_ACTOR_ID_REQUIRED = "claim.actor.id.required";
    public static final String CLAIM_PRODUCT_ID_REQUIRED = "claim.product.id.required";
    public static final String CLAIM_ID_NOT_FOUND = "claim.id.not.found";
    public static final String CLAIM_REFERENCE_CONFLICT = "claim.reference.conflict";
    public static final String CLAIM_ACTOR_ID_NOT_FOUND = "claim.actor.id.not.found";
    public static final String CLAIM_PRODUCT_ID_NOT_FOUND = "claim.product.id.not.found";
    public static final String CLAIM_PRODUCT_ID_NOT_CHANGE = "claim.product.id.not.change";
    public static final String CLAIM_LINE_ID_NOT_FOUND = "claim.line.id.not.found";
    public static final String CLAIM_LINE_REASON_REQUIRED = "claim.line.reason.required";
    public static final String CLAIM_HAS_NON_INSTRUCTED = "claim.has.non.instructed";
    public static final String CLAIM_STATE_NOT_INSTRUCTION_REJECTED = "claim.state.not.instruction.rejected";
    public static final String CLAIM_STATE_NOT_INSTRUCTION_DONE = "claim.state.not.instruction.done";
    public static final String CLAIM_STATE_NOT_COMPLETE_COMPLIANT = "claim.state.not.complete.compliant";
}
