package fr.xenonbyte.optifact.backend.application.claim.port.in;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface PrintClaimReceiptUseCase {
  byte[] printClaimReceipt(String claimId);
}
