package fr.xenonbyte.optifact.backend.application.claim;

import fr.xenonbyte.optifact.backend.application.claim.port.in.PrintClaimReceiptUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.out.ClaimRepository;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.FindAttachmentByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.FindAttachmentByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.FindAttachmentTypeByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.FindAttachmentTypeByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindFirstSettingUseCase;
import fr.xenonbyte.optifact.backend.application.printer.port.in.PrintManagerUseCase;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.FindInvoiceByClaimIdUseCase;
import fr.xenonbyte.optifact.backend.application.claim.exception.ClaimIdNotFoundException;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLine;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLineStatus;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.logging.Logger;
import java.util.stream.Collectors;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class PrintClaimReceiptApplicationService implements PrintClaimReceiptUseCase {

    private static final Logger LOGGER = Logger.getLogger(PrintClaimReceiptApplicationService.class.getName());

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final ClaimRepository repository;
    private final PrintManagerUseCase printManagerUseCase;
    private final FindFirstSettingUseCase findFirstSettingUseCase;
    private final FindInvoiceByClaimIdUseCase findInvoiceByClaimIdUseCase;
    private final FindAttachmentByIdUseCase findAttachmentByIdUseCase;
    private final FindAttachmentTypeByIdUseCase findAttachmentTypeByIdUseCase;

    public PrintClaimReceiptApplicationService(ClaimRepository repository,
                                               PrintManagerUseCase printManagerUseCase,
                                               FindFirstSettingUseCase findFirstSettingUseCase,
                                               FindInvoiceByClaimIdUseCase findInvoiceByClaimIdUseCase,
                                               FindAttachmentByIdUseCase findAttachmentByIdUseCase,
                                               FindAttachmentTypeByIdUseCase findAttachmentTypeByIdUseCase) {
        this.repository = repository;
        this.printManagerUseCase = printManagerUseCase;
        this.findFirstSettingUseCase = findFirstSettingUseCase;
        this.findInvoiceByClaimIdUseCase = findInvoiceByClaimIdUseCase;
        this.findAttachmentByIdUseCase = findAttachmentByIdUseCase;
        this.findAttachmentTypeByIdUseCase = findAttachmentTypeByIdUseCase;
    }

    @Override
    public byte[] printClaimReceipt(String claimId) {
        LOGGER.info("Printing claim receipt with id: '" + claimId + "'");
        UUID id = UUID.fromString(claimId);

        Claim claim = repository.findById(id).orElseThrow(() -> new ClaimIdNotFoundException(id));

        Setting setting = findFirstSettingUseCase.findFirstSetting();

        // Try to resolve dossier fee invoice number (fallback to first invoice reference if any)
        List<Invoice> invoices = findInvoiceByClaimIdUseCase.findInvoiceByClaimId(id);
        String dossierInvoiceNumber = invoices.isEmpty() ? "" : invoices.get(0).getReference();

        Map<String, Object> model = buildModel(claim, setting, dossierInvoiceNumber);

        return printManagerUseCase.print(model, "receipt/claim-receipt");
    }

    private Map<String, Object> buildModel(Claim claim, Setting setting, String dossierInvoiceNumber) {
        Map<String, Object> m = new HashMap<>();
        // Company (header/footer)
        if (setting != null && setting.getCompany() != null) {
            var company = setting.getCompany();
            m.put("companyName", company.getName());
            if (company.getAddress() != null) {
                var a = company.getAddress();
                m.put("companyAddress", joinNotBlank(
                        a.getStreet(),
                        a.getCity(),
                        a.getZipCode(),
                        a.getCountry()
                ));
                m.put("companyWebsite", a.getWebsite());
            }
            if (company.getContact() != null) {
                var c = company.getContact();
                m.put("companyEmail", c.getEmail());
                m.put("companyPhone", c.getPhone());
            }
            m.put("logoUrl", company.getLogoFilename());
        }

        // Claim data
        m.put("claimNumber", claim.getReference());
        m.put("creationDate", claim.getCreatedAt() == null ? "" : DATE_FORMAT.format(claim.getCreatedAt()));
        m.put("submissionDate", claim.getSubmitAt() == null ? "" : DATE_FORMAT.format(claim.getSubmitAt()));
        m.put("dossierInvoiceNumber", dossierInvoiceNumber);

        // Lines table: type, deposited, instructed
        List<Map<String, Object>> rows = claim.getLines().stream().map(this::toRow).collect(Collectors.toList());
        m.put("rows", rows);

        // Title
        m.put("title", "Récépissé de dépôt N° " + claim.getReference());
        return m;
    }

    private Map<String, Object> toRow(ClaimLine line) {
        Map<String, Object> row = new HashMap<>();
        // Without attachment type resolution here, provide a generic label
        Attachment attachment = findAttachmentByIdUseCase.findAttachmentById(line.getAttachmentId());
        AttachmentType attachmentType = findAttachmentTypeByIdUseCase.findAttachmentTypeById(attachment.getAttachmentTypeId());
        row.put("type", attachmentType != null && !attachmentType.getName().isBlank()? attachmentType.getName() : "Document");
        boolean deposited = line.getStatus() != null && line.getStatus() != ClaimLineStatus.DRAFT && line.getStatus() != ClaimLineStatus.CANCELLED;
        boolean instructed = line.getStatus() == ClaimLineStatus.VALIDATED;
        row.put("deposited", deposited);
        row.put("instructed", instructed);
        return row;
    }

    private static String joinNotBlank(String... parts) {
        return java.util.Arrays.stream(parts)
                .filter(p -> p != null && !p.isBlank())
                .collect(Collectors.joining(", "));
    }
}
