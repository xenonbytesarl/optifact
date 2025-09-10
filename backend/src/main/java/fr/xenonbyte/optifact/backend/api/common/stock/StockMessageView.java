package fr.xenonbyte.optifact.backend.api.common.stock;

/**
 * Common stock-related API messages (including sequences)
 */
public final class StockMessageView {
    private StockMessageView() {}

    // Sequence messages
    public static final String SEQUENCE_CREATED_SUCCESSFULLY = "sequence.created";
    public static final String SEQUENCE_DELETED_SUCCESSFULLY = "sequence.deleted";
    public static final String SEQUENCE_UPDATED_SUCCESSFULLY = "sequence.updated";
    public static final String SEQUENCE_FOUND_SUCCESSFULLY = "sequence.found";
    public static final String SEQUENCES_FOUND_SUCCESSFULLY = "sequences.found";
}
