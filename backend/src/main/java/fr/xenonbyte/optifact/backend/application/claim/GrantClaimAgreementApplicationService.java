package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimStateNotCompleteCompliantBadException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.GrantClaimAgreementClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepository;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.CreateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.ValidateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceLine;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceState;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;
import fr.xenonbyte.optifact.backend.domain.product.product.ProductType;

import java.math.BigDecimal;
import java.time.ZonedDateTime;
import java.util.Currency;
import java.util.List;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class GrantClaimAgreementApplicationService implements GrantClaimAgreementClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(GrantClaimAgreementApplicationService.class.getName());

    private final ClaimRepository repository;
    private final ProductRepository productRepository;
    private final InvoiceRepository invoiceRepository;
    private final CreateInvoiceUseCase createInvoiceUseCase;
    private final ValidateInvoiceUseCase validateInvoiceUseCase;
    private final SequenceRepository sequenceRepository;

    public GrantClaimAgreementApplicationService(
            ClaimRepository repository,
            ProductRepository productRepository,
            InvoiceRepository invoiceRepository,
            CreateInvoiceUseCase createInvoiceUseCase,
            ValidateInvoiceUseCase validateInvoiceUseCase,
            SequenceRepository sequenceRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.invoiceRepository = invoiceRepository;
        this.createInvoiceUseCase = createInvoiceUseCase;
        this.validateInvoiceUseCase = validateInvoiceUseCase;
        this.sequenceRepository = sequenceRepository;
    }

    @Override
    public Claim grantClaimAgreement(UUID claimId, UUID grantedAttachmentDecisionId) {
        LOGGER.info("Grant claim agreement with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        if(!claim.isCompleteCompliant()) {
            throw new ClaimStateNotCompleteCompliantBadException();
        }

        generateInvoice(claimId, claim);

        //TODO the agreementById will be set when user management will be completed
        claim = claim.withAgreementGranted(ZonedDateTime.now(), null, grantedAttachmentDecisionId);

        claim = repository.save(claim);

        LOGGER.info("Grant claim agreement successfully with id: '" + claim.getId() + "'");
        return claim;
    }

    private void generateInvoice(UUID claimId, Claim claim) {
        // We check if the product id is correct and if the extra product id is correct
        UUID productId = claim.getProductId();
        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ProductIdNotFoundException(productId)
        );

        Currency currency = product.getCurrency() == null ? Currency.getInstance("XAF") : product.getCurrency();
        InvoiceLine invoiceLine = InvoiceLine.create(
                product.getId(),
                product.getName(),
                product.getType().equals(ProductType.PERCENTAGE)? product.getRate()/100.0: 1.0 ,
                product.getType().equals(ProductType.PERCENTAGE)? BigDecimal.ZERO: product.getAmount(),
                currency, //TODO set a default product currency when product currency is null or product type is rate
                null,
                currency, //TODO set a default product currency when product currency is null or product type is rate
                null
        ).computeAmount();

        Invoice invoice = Invoice.create(
                null,
                ZonedDateTime.now(),
                null,
                claim.getActorId(),
                ZonedDateTime.now().plusDays(30L),
                null,
                currency,
                claimId,
                null, //TODO will populate when company information will complete
                InvoiceState.DRAFT,
                List.of(invoiceLine)
        );

        invoice = createInvoiceUseCase.createInvoice(invoice);
        validateInvoiceUseCase.validateInvoice(invoice.getId());
    }
}
