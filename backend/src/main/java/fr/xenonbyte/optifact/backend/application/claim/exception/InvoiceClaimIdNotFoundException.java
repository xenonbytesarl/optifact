package fr.xenonbyte.optifact.backend.application.claim.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.domain.claim.message.ClaimMessage;
import fr.xenonbyte.optifact.backend.domain.invoice.message.InvoiceMessage;

import java.util.UUID;

/**
 * @author bamk
 * @version 1.0
 * @since 17/09/2025
 */
public final class InvoiceClaimIdNotFoundException extends NotFoundException {
    public InvoiceClaimIdNotFoundException(UUID claimId) {
        super(InvoiceMessage.INVOICE_CLAIM_ID_NOT_FOUND, claimId);
    }
}
