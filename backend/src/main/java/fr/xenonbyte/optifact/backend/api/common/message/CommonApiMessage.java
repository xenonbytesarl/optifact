package fr.xenonbyte.optifact.backend.api.common.message;


public final class CommonApiMessage {

    private CommonApiMessage() {}

    public static final String COMMON_NOT_EMPTY = "common.not.empty";
    public static final String COMMON_NOT_NULL = "common.not.null";
    public static final String COMMON_NOT_BLANK = "common.not.blank";

    // Global validation error messages
    public static final String VALIDATION_ERROR_OCCURRED_WHEN_PROCESSING_REQUEST = "validation.error.occurred.when.processing.request";
    public static final String UNEXPECTED_ERROR_OCCURRED_WHEN_PROCESSING_REQUEST = "unexpected.error.occurred.when.processing.request";

}
