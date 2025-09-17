package fr.xenonbyte.optifact.backend.api.claim;

import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimApiRequestView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimLineResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimPageResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.InvoiceResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.InvoiceStateView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.RejectClaimLineRequest;
import fr.xenonbyte.optifact.backend.application.claim.port.in.CreateClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.DeleteClaimByIdUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.TerminateInstructionClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.FindClaimByIdUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.InstructClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.RejectClaimLineUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.SearchClaimsUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.SubmitClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.UpdateClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.UploadClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.ValidateClaimLineUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.BackClaimToDraftUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.CompleteCompliantClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.GrantClaimAgreementClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.RefuseClaimAgreementClaimUseCase;
import fr.xenonbyte.optifact.backend.application.claim.port.in.AdjournClaimAgreementClaimUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.FindAttachmentByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.FindAttachmentByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachment.port.in.UploadAttachmentUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.FindAttachmentTypeByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.common.exception.TechnicalException;
import fr.xenonbyte.optifact.backend.application.common.file.exception.FileNameBadException;
import fr.xenonbyte.optifact.backend.application.common.file.exception.FileNameNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Direction;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.application.invoice.port.in.FindInvoiceByClaimIdUseCase;
import fr.xenonbyte.optifact.backend.domain.claim.Claim;
import fr.xenonbyte.optifact.backend.domain.claim.ClaimLine;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;
import fr.xenonbyte.optifact.backend.domain.common.attachment.Attachment;
import fr.xenonbyte.optifact.backend.domain.invoice.Invoice;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import static org.springframework.http.HttpStatus.OK;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.PRIMARY_ADAPTER)
@Hexagonal.PrimaryAdapter
public class ClaimAdapterView {

    private final CreateClaimUseCase createUseCase;
    private final UpdateClaimUseCase updateUseCase;
    private final FindClaimByIdUseCase findByIdUseCase;
    private final DeleteClaimByIdUseCase deleteByIdUseCase;
    private final SearchClaimsUseCase searchUseCase;
    private final ClaimMapperView mapperView;
    private final FindAttachmentTypeByIdsUseCase findAttachmentTypeByIdsUseCase;
    private final FindAttachmentByIdsUseCase findAttachmentByIdsUseCase;
    private final UploadClaimUseCase uploadClaimUseCase;
    private final UploadAttachmentUseCase uploadAttachmentUseCase;
    private final FindAttachmentByIdUseCase findAttachmentByIdUseCase;
    private final SubmitClaimUseCase submitClaimUseCase;
    private final InstructClaimUseCase instructClaimUseCase;
    private final ValidateClaimLineUseCase validateClaimLineUseCase;
    private final RejectClaimLineUseCase rejectClaimLineUseCase;
    private final TerminateInstructionClaimUseCase terminateInstructionClaimUseCase;
    private final BackClaimToDraftUseCase backClaimToDraftUseCase;
    private final CompleteCompliantClaimUseCase completeCompliantClaimUseCase;
    private final GrantClaimAgreementClaimUseCase grantClaimAgreementClaimUseCase;
    private final RefuseClaimAgreementClaimUseCase refuseClaimAgreementClaimUseCase;
    private final AdjournClaimAgreementClaimUseCase adjournClaimAgreementClaimUseCase;
    private final FindInvoiceByClaimIdUseCase findInvoiceByClaimIdUseCase;

    @Value("${optifact.file.claim.rootDirectory}")
    private String rootDirectory;

    public ClaimAdapterView(CreateClaimUseCase createUseCase,
                            UpdateClaimUseCase updateUseCase,
                            FindClaimByIdUseCase findByIdUseCase,
                            DeleteClaimByIdUseCase deleteByIdUseCase,
                            SearchClaimsUseCase searchUseCase,
                            ClaimMapperView mapperView,
                            FindAttachmentTypeByIdsUseCase findAttachmentTypeByIdsUseCase,
                            FindAttachmentByIdsUseCase findAttachmentByIdsUseCase,
                            UploadClaimUseCase uploadClaimUseCase,
                            UploadAttachmentUseCase uploadAttachmentUseCase,
                            FindAttachmentByIdUseCase findAttachmentByIdUseCase,
                            SubmitClaimUseCase submitClaimUseCase,
                            InstructClaimUseCase instructClaimUseCase,
                            ValidateClaimLineUseCase validateClaimLineUseCase,
                            RejectClaimLineUseCase rejectClaimLineUseCase,
                            TerminateInstructionClaimUseCase terminateInstructionClaimUseCase,
                            BackClaimToDraftUseCase backClaimToDraftUseCase,
                            CompleteCompliantClaimUseCase completeCompliantClaimUseCase,
                            GrantClaimAgreementClaimUseCase grantClaimAgreementClaimUseCase,
                            RefuseClaimAgreementClaimUseCase refuseClaimAgreementClaimUseCase,
                            AdjournClaimAgreementClaimUseCase adjournClaimAgreementClaimUseCase,
                            FindInvoiceByClaimIdUseCase findInvoiceByClaimIdUseCase) {
        this.createUseCase = createUseCase;
        this.updateUseCase = updateUseCase;
        this.findByIdUseCase = findByIdUseCase;
        this.deleteByIdUseCase = deleteByIdUseCase;
        this.searchUseCase = searchUseCase;
        this.mapperView = mapperView;
        this.findAttachmentTypeByIdsUseCase = findAttachmentTypeByIdsUseCase;
        this.findAttachmentByIdsUseCase = findAttachmentByIdsUseCase;
        this.uploadClaimUseCase = uploadClaimUseCase;
        this.uploadAttachmentUseCase = uploadAttachmentUseCase;
        this.findAttachmentByIdUseCase = findAttachmentByIdUseCase;
        this.submitClaimUseCase = submitClaimUseCase;
        this.instructClaimUseCase = instructClaimUseCase;
        this.validateClaimLineUseCase = validateClaimLineUseCase;
        this.rejectClaimLineUseCase = rejectClaimLineUseCase;
        this.terminateInstructionClaimUseCase = terminateInstructionClaimUseCase;
        this.backClaimToDraftUseCase = backClaimToDraftUseCase;
        this.completeCompliantClaimUseCase = completeCompliantClaimUseCase;
        this.grantClaimAgreementClaimUseCase = grantClaimAgreementClaimUseCase;
        this.refuseClaimAgreementClaimUseCase = refuseClaimAgreementClaimUseCase;
        this.adjournClaimAgreementClaimUseCase = adjournClaimAgreementClaimUseCase;
        this.findInvoiceByClaimIdUseCase = findInvoiceByClaimIdUseCase;
    }

    public ClaimResponseView createClaim(ClaimApiRequestView view) {
        return mapperView.toResponseView(createUseCase.createClaim(mapperView.toDomain(view)));
    }

    public ClaimResponseView updateClaim(UUID id, ClaimApiRequestView view) {
        return mapperView.toResponseView(updateUseCase.updateClaim(id, mapperView.toDomain(view)));
    }

    public void deleteClaimById(UUID id) {
        deleteByIdUseCase.deleteClaimById(id);
    }

    public ClaimResponseView findClaimById(UUID id) {
        Claim claim = findByIdUseCase.findClaimById(id);

        // Collect unique attachment IDs from claim lines
        Set<UUID> attachmentIds = claim.getLines().stream()
                .map(ClaimLine::getAttachmentId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        List<Invoice> invoices = findInvoiceByClaimIdUseCase.findInvoiceByClaimId(id);

        // If no attachments referenced, just map the claim and return
        if (attachmentIds.isEmpty() && invoices.isEmpty()) {
            return mapperView.toResponseView(claim);
        }

        // Load attachments at once and index them by their ID
        List<Attachment> attachments = findAttachmentByIdsUseCase.findAttachmentByIds(attachmentIds);

        if (attachments.isEmpty() && invoices.isEmpty()) {
            return mapperView.toResponseView(claim);
        }
        // Build the response and enrich lines in O(n)
        ClaimResponseView responseView = mapperView.toResponseView(claim);
        if(!attachments.isEmpty()) {
            Map<UUID, Attachment> attachmentById = attachments.stream()
                    .collect(Collectors.toMap(Attachment::getId, a -> a, (a, b) -> a));

            // Load attachment types for the found attachments and index name by type ID
            Set<UUID> attachmentTypeIds = attachments.stream()
                    .map(Attachment::getAttachmentTypeId)
                    .filter(Objects::nonNull)
                    .collect(Collectors.toSet());

            Map<UUID, String> attachmentTypeNameById = attachmentTypeIds.isEmpty()
                    ? Map.of()
                    : findAttachmentTypeByIdsUseCase.findAttachmentTypeByIds(attachmentTypeIds)
                    .stream()
                    .collect(Collectors.toMap(AttachmentType::getId, AttachmentType::getName));

            List<@Valid ClaimLineResponseView> enrichedLines = responseView.getLines().stream().map(line -> {
                UUID lineAttachmentId = line.getAttachmentId();
                if (lineAttachmentId != null) {
                    Attachment att = attachmentById.get(lineAttachmentId);
                    if (att != null) {
                        String typeName = attachmentTypeNameById.get(att.getAttachmentTypeId());
                        if (typeName != null) {
                            line.setAttachmentTypeName(typeName);
                        }
                    }
                }
                return line;
            }).toList();
            responseView.setLines(enrichedLines);
        }

        if(!invoices.isEmpty()) {
            List<InvoiceResponseView> invoiceResponseViews = invoices.stream()
                    .map(invoice -> new InvoiceResponseView()
                            .id(invoice.getId())
                            .reference(invoice.getReference())
                            .amount(invoice.getAmount())
                            .status(InvoiceStateView.valueOf(invoice.getState().name()))
                            .createAt(invoice.getCreatedAt().toOffsetDateTime())
                            .currency(invoice.getAmountCurrency().getCurrencyCode())
                    )
                    .toList();
            responseView.setInvoices(invoiceResponseViews);
        }
        return responseView;
    }

    public ClaimPageResponseView searchClaims(String referenceFilter,
                                              Integer page,
                                              Integer size,
                                              String sortField,
                                              String sortDirection,
                                              String actorName,
                                              String productName) {
        long safePage = page == null ? 0L : page.longValue();
        long safeSize = size == null ? 20L : size.longValue();
        String safeSort = (sortField == null || sortField.isBlank()) ? "createdAt" : sortField;
        Direction safeDirection;
        if (sortDirection == null) {
            safeDirection = Direction.ASC;
        } else {
            try { safeDirection = Direction.valueOf(sortDirection.trim().toUpperCase()); }
            catch (IllegalArgumentException ex) { safeDirection = Direction.ASC; }
        }
        Pagination<Claim> pageResult = searchUseCase.searchClaims(
                referenceFilter,
                actorName,
                productName,
                new CommonSearch(safePage, safeSize, safeSort, safeDirection)
        );
        return mapperView.toResponsePageView(pageResult);
    }

    public ClaimResponseView transfertClaimAttachment(UUID claimId, UUID claimLineId, UUID attachmentId, MultipartFile file) {
        Claim claim = findByIdUseCase.findClaimById(claimId);
        Attachment attachment = findAttachmentByIdUseCase.findAttachmentById(attachmentId);

        String filename = file.getOriginalFilename();

        String mimeType = file.getContentType();

        try {
            uploadAttachmentUseCase.uploadFile(attachment, claim.getReference(), mimeType, filename, rootDirectory, file.getBytes());
        } catch (IOException e) {
            throw new TechnicalException(e.getMessage(), e);
        }

        claim = uploadClaimUseCase.uploadClaim(claimId, claimLineId);

        return mapperView.toResponseView(claim);

    }

    public ResponseEntity<Resource> downloadAttachment(UUID claimId, UUID attachmentId) {
        // Ensure claim exists (also validates access in a real scenario)
        Claim claim = findByIdUseCase.findClaimById(claimId);
        Attachment attachment = findAttachmentByIdUseCase.findAttachmentById(attachmentId);

        String filepath = attachment.getFilename();
        if (filepath == null || filepath.isBlank()) {
            throw new FileNameBadException(attachmentId.toString());
        }

        Path path = Paths.get(filepath);
        File file = path.toFile();
        if (!file.exists() || !file.isFile()) {
            throw new FileNameNotFoundException(filepath);
        }

        Resource resource = new FileSystemResource(file);
        String downloadName = path.getFileName().toString();
        String mime = attachment.getMimeType() == null || attachment.getMimeType().isBlank() ? "application/octet-stream" : attachment.getMimeType();

        return ResponseEntity
                .status(OK)
                .header("Content-Disposition", "attachment; filename=\"" + downloadName + "\"")
                .header("Content-Type", mime)
                .body(resource);
    }

    public ClaimResponseView rejectClaimLine(UUID claimId, UUID claimLineId, RejectClaimLineRequest request) {
        return mapperView.toResponseView(rejectClaimLineUseCase.rejectClaimLine(claimId, claimLineId, request.getReason()));
    }

    public ClaimResponseView validateClaimLine(UUID claimId, UUID claimLineId) {
        return mapperView.toResponseView(validateClaimLineUseCase.validateClaimLine(claimId, claimLineId));
    }

    public ClaimResponseView submitClaim(UUID claimId) {
        return mapperView.toResponseView(submitClaimUseCase.submitClaim(claimId));
    }

    public ClaimResponseView instruction(UUID claimId) {
        return mapperView.toResponseView(instructClaimUseCase.instructClaim(claimId));
    }

    public ClaimResponseView terminateInstruction(UUID claimId) {
        return mapperView.toResponseView(terminateInstructionClaimUseCase.terminateInstructClaim(claimId));
    }

    public ClaimResponseView backToDraft(UUID claimId) {
        return mapperView.toResponseView(backClaimToDraftUseCase.backClaimToDraft(claimId));
    }

    public ClaimResponseView completeCompliant(UUID claimId) {
        return mapperView.toResponseView(completeCompliantClaimUseCase.completeCompliantClaim(claimId));
    }

    public ClaimResponseView agreementGranted(UUID claimId) {
        return mapperView.toResponseView(grantClaimAgreementClaimUseCase.grantClaimAgreement(claimId));
    }

    public ClaimResponseView agreementRefused(UUID claimId) {
        return mapperView.toResponseView(refuseClaimAgreementClaimUseCase.refuseClaimAgreement(claimId));
    }

    public ClaimResponseView agreementAdjourned(UUID claimId) {
        return mapperView.toResponseView(adjournClaimAgreementClaimUseCase.adjournClaimAgreement(claimId));
    }
}
