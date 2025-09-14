package fr.xenonbyte.optifact.backend.api.claim;

import fr.xenonbyte.optifact.backend.api.claim.generated.ClaimsApi;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ApiSuccessResponse;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimApiRequestView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimApiResponseView;
import fr.xenonbyte.optifact.backend.api.claim.generated.view.ClaimPageApiResponseView;
import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import org.springframework.core.io.Resource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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
    public ResponseEntity<ClaimApiResponseView> createClaim(String acceptLanguage, ClaimApiRequestView claimApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new ClaimApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(CREATED.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
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
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIM_DELETED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
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
    public ResponseEntity<ClaimPageApiResponseView> searchClaims(String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String referenceFilter, String actorName, String productName) {
        return ResponseEntity.status(OK).body(
                new ClaimPageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(ClaimMessageView.CLAIMS_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchClaims(referenceFilter, page, size, sortField, sortDirection, actorName, productName)))
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
}
