package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.claim.port.in.SubmitClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindFirstSettingUseCase;
import fr.xenonbyte.optifact.backend.application.common.sequence.port.secondary.SequenceRepository;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.CreateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.ValidateInvoiceUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.out.InvoiceRepository;
import fr.xenonbyte.optifact.backend.application.notification.ports.in.SendEmailUseCase;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductExtraIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.exception.ProductIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.product.port.out.ProductRepository;
import fr.xenonbyte.optifact.backend.application.claim.port.in.PrintClaimReceiptUseCase;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.actor.contact.Contact;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import fr.xenonbyte.optifact.backend.domain.common.vo.EmailAttachment;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceLine;
import fr.xenonbyte.optifact.backend.domain.invoice.InvoiceState;
import fr.xenonbyte.optifact.backend.domain.product.product.Product;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
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

    private final PrintClaimReceiptUseCase printClaimReceiptUseCase;
    private final SendEmailUseCase sendEmailUseCase;
    private final FindFirstSettingUseCase findFirstSettingUseCase;
    private final ActorRepository actorRepository;

    public SubmitClaimApplicationService(
            ClaimRepository repository,
            ProductRepository productRepository,
            InvoiceRepository invoiceRepository,
            CreateInvoiceUseCase createInvoiceUseCase,
            ValidateInvoiceUseCase validateInvoiceUseCase,
            SequenceRepository sequenceRepository,
            PrintClaimReceiptUseCase printClaimReceiptUseCase,
            SendEmailUseCase sendEmailUseCase,
            FindFirstSettingUseCase findFirstSettingUseCase,
            ActorRepository actorRepository) {
        this.repository = repository;
        this.productRepository = productRepository;
        this.invoiceRepository = invoiceRepository;
        this.createInvoiceUseCase = createInvoiceUseCase;
        this.validateInvoiceUseCase = validateInvoiceUseCase;
        this.printClaimReceiptUseCase = printClaimReceiptUseCase;
        this.sendEmailUseCase = sendEmailUseCase;
        this.findFirstSettingUseCase = findFirstSettingUseCase;
        this.actorRepository = actorRepository;
    }

    @Override
    public Claim submitClaim(UUID claimId) {
        LOGGER.info("Submitting claim with id: '" + claimId + "'");

        Claim claim = repository.findById(claimId).orElseThrow(
                () -> new ClaimIdNotFoundException(claimId)
        );

        claim = claim.withSubmit(ZonedDateTime.now());

        Invoice invoice = null;

        if(!invoiceRepository.existsByClaimId(claimId)) {
            invoice = generateClaimInvoiceStudyFeeds(claimId, claim);
        }

        claim = repository.save(claim);

        // Generate PDF receipt
        byte[] pdf = new byte[0];
        try {
            pdf = printClaimReceiptUseCase.printClaimReceipt(claimId.toString());
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to generate claim receipt PDF for claim '" + claimId + "'", e);
        }

        // Prepare and send email with attachment to claimant contacts
        try {
            Actor actor = actorRepository.findById(claim.getActorId()).orElse(null);
            List<String> recipients = new ArrayList<>((actor == null || actor.getContacts() == null)
                    ? List.of()
                    : actor.getContacts().stream()
                    .map(Contact::getEmail)
                    .filter(Objects::nonNull)
                    .map(String::trim)
                    .filter(s -> !s.isBlank())
                    .distinct()
                    .toList());
            Setting setting = findFirstSettingUseCase.findFirstSetting();
            EmailServer server = setting.getEmailServer();
            recipients.add(setting.getCompany().getContact().getEmail());
            EmailAttachment attachment = (pdf != null && pdf.length > 0)
                    ? new EmailAttachment("claim-receipt-" + claim.getReference() + ".pdf", "application/pdf", pdf)
                    : null;

            assert actor != null;
            Map<String, Object> model = Map.of(
                    "applicationName", "COSUMAF",
                    "claimReference", claim.getReference(),
                    "name", actor.getName()
            );

            CompletableFuture.runAsync(() -> {
                try {
                    if (attachment != null) {
                        sendEmailUseCase.send(
                                "email/claim-receipt",
                                model,
                                recipients,
                                "Votre récépissé de dépôt",
                                server,
                                List.of(attachment)
                        );
                    } else {
                        sendEmailUseCase.send(
                                "email/claim-receipt",
                                model,
                                recipients,
                                "Votre récépissé de dépôt",
                                server
                        );
                    }
                    LOGGER.info("Claim receipt email dispatch queued to '" + recipients + "'");
                } catch (Exception e) {
                    LOGGER.log(Level.SEVERE, "Failed to send claim receipt email asynchronously", e);
                }
            });
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Unexpected error while preparing claim receipt email for claim '" + claimId + "'", e);
        }

        LOGGER.info("Claim submitted successfully with id: '" + claim.getId() + "'");
        return claim;
    }

    private Invoice generateClaimInvoiceStudyFeeds(UUID claimId, Claim claim) {
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

        return validateInvoiceUseCase.validateInvoice(invoice.getId());
    }
}
