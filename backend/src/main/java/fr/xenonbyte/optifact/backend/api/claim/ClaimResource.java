package fr.xenonbyte.optifact.backend.api.claim;

import fr.xenonbyte.optifact.backend.api.claim.generated.ClaimsApi;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ApiSuccessResponse;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimApiRequestView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimApiResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimPageApiResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.RejectClaimLineRequest;
import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.time.ZonedDateTime;
import java.util.Locale;
import java.util.UUID;

import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.CONTENT;
import static java.util.Map.of;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class ClaimResource implements ClaimsApi {

    private final ClaimAdapterView adapterView;

    public ClaimResource(ClaimAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> agreementAdjourned(String acceptLanguage, UUID claimId) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_AGREEMENT_ADJOURNED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.agreementAdjourned(claimId)))
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> agreementGranted(String acceptLanguage, UUID claimId, MultipartFile file) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_AGREEMENT_GRANTED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.agreementGranted(claimId, file)))
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> agreementRefused(String acceptLanguage, UUID claimId, MultipartFile file) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_AGREEMENT_REFUSED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.agreementRefused(claimId, file)))
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> backToDraft(String acceptLanguage, UUID claimId) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_BACK_TO_DRAFT_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.backToDraft(claimId)))
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> completeCompliant(String acceptLanguage, UUID claimId) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_COMPLETE_COMPLIANT_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.completeCompliant(claimId)))
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> createClaim(String acceptLanguage, ClaimApiRequestView claimApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(CREATED.name())
                        .message(ClaimMessageView.CLAIM_CREATED_SUCCESSFULLY)
                        .data(of(CONTENT, adapterView.createClaim(claimApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<ApiSuccessResponse> deleteClaim(String acceptLanguage, UUID claimId) {
        adapterView.deleteClaimById(claimId);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(ClaimMessageView.CLAIM_DELETED_SUCCESSFULLY)
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> terminateInstruction(String acceptLanguage, UUID claimId) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_TERMINATE_INSTRUCTION_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.terminateInstruction(claimId)))
        );
    }

    @Override
    public ResponseEntity<Resource> downloadClaimAttachment(String acceptLanguage, UUID claimId, UUID attachmentId) {
        return adapterView.downloadAttachment(claimId, attachmentId);
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> findClaimById(String acceptLanguage, UUID claimId) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findClaimById(claimId)))
        );
    }

    @Override
    public ResponseEntity<Resource> printClaimReceipt(String acceptLanguage, UUID claimId) {
        return adapterView.printClaimReceipt(claimId);
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> rejectClaimLine(String acceptLanguage, UUID claimId, UUID claimLineId, RejectClaimLineRequest rejectClaimLineRequest) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_LINE_REJECTED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.rejectClaimLine(claimId, claimLineId, rejectClaimLineRequest)))
        );
    }

    @Override
    public ResponseEntity<ClaimPageApiResponseView> searchClaims(String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String referenceFilter, String stateFilter, String actorNameFilter, String productNameFilter) {
        return ResponseEntity.status(OK).body(
                new ClaimPageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIMS_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchClaims(referenceFilter, stateFilter, actorNameFilter, productNameFilter, page, size, sortField, sortDirection)))
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> submitClaim(String acceptLanguage, UUID claimId) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_LINE_SUBMIT_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.submitClaim(claimId)))
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> toInstruction(String acceptLanguage, UUID claimId) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_INSTRUCTION_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.instruction(claimId)))
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> transfertClaimAttachment(String acceptLanguage, UUID claimId, UUID claimLineId, UUID attachmentId, MultipartFile file) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIMS_UPLOAD_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.transfertClaimAttachment(claimId, claimLineId, attachmentId, file)))
        );
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> updateClaim(String acceptLanguage, UUID claimId, ClaimApiRequestView claimApiRequestView) {
        return null;
    }

    @Override
    public ResponseEntity<ClaimApiResponseView> validateClaimLine(String acceptLanguage, UUID claimId, UUID claimLineId) {
        return ResponseEntity.status(OK).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_LINE_VALIDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.validateClaimLine(claimId, claimLineId)))
        );
    }
}
