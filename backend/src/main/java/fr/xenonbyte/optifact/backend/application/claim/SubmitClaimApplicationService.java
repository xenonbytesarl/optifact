package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.exception.InvoiceClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.SubmitClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepository;
import fr.xenonbyte.optifact.backend.application.invoice.CreateInvoiceApplicationService;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.CreateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.ValidateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductExtraIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceLine;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceState;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.Currency;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SubmitClaimApplicationService implements SubmitClaimUseCase {

    private static final Logger LOGGER = Logger.getLogger(SubmitClaimApplicationService.class.getName());

    private final ClaimRepository repository;
    private final ProductRepository productRepository;
    private final InvoiceRepository invoiceRepository;
    private final CreateInvoiceUseCase createInvoiceUseCase;
    private final ValidateInvoiceUseCase validateInvoiceUseCase;
    private final SequenceRepository sequenceRepository;

    public SubmitClaimApplicationService(
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
    public Claim submitClaim(UUID claimId) {
        LOGGER.info("Submitting claim with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        claim = claim.withSubmit(ZonedDateTime.now());

        if(!invoiceRepository.existsByClaimId(claimId)) {
            generateClaimInvoiceStudyFeeds(claimId, claim);
        }

        claim = repository.save(claim);

        LOGGER.info("Claim submitted successfully with id: '" + claim.getId() + "'");
        return claim;
    }

    private void generateClaimInvoiceStudyFeeds(UUID claimId, Claim claim) {
        // We check if the product id is correct and if the extra product id is correct
        UUID productId = claim.getProductId();
        Product product = productRepository.findById(productId).orElseThrow(
                () -> new ProductIdNotFoundException(productId)
        );
        product.checkExtraProductId();

        //We check if the extra product id is correct
        Product extraProduct = productRepository.findById(product.getExtraProductId()).orElseThrow(
                () -> new ProductExtraIdNotFoundException(product.getExtraProductId())
        );

        InvoiceLine invoiceLine = InvoiceLine.create(
                extraProduct.getId(),
                extraProduct.getName(),
                1.0,
                extraProduct.getAmount(),
                extraProduct.getCurrency(),
                null,
                extraProduct.getCurrency(),
                null
        ).computeAmount();

        Invoice invoice = Invoice.create(
                null,
                ZonedDateTime.now(),
                null,
                claim.getActorId(),
                ZonedDateTime.now().plusDays(30L),
                null,
                extraProduct.getCurrency(),
                claimId,
                null, //TODO will populate when company information will complete
                InvoiceState.DRAFT,
                List.of(invoiceLine)
        );

        invoice = createInvoiceUseCase.createInvoice(invoice);

        validateInvoiceUseCase.validateInvoice(invoice.getId());
    }
}
