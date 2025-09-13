package fr.xenonbyte.optifact.backend.api.common.attachment;

import fr.xenonbyte.optifact.backend.api.common.attachment.generated.AttachmentsApi;
import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.ApiSuccessResponse;
import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.AttachmentApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.AttachmentApiResponseView;
import fr.xenonbyte.optifact.backend.api.common.attachment.generated.view.AttachmentPageApiResponseView;
import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.ZonedDateTime;
import java.util.Locale;
import java.util.UUID;

import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.CONTENT;
import static java.util.Map.of;
import static org.springframework.http.HttpStatus.CREATED;
import static org.springframework.http.HttpStatus.OK;

@RestController
public class AttachmentResource implements AttachmentsApi {

    private final AttachmentAdapterView adapterView;

    public AttachmentResource(AttachmentAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<AttachmentApiResponseView> createAttachment(String acceptLanguage, AttachmentApiRequestView attachmentApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new AttachmentApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(CREATED.name())
                        .message(MessageUtil.getMessage(AttachmentMessageView.ATTACHMENT_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.createAttachment(attachmentApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<ApiSuccessResponse> deleteAttachment(String acceptLanguage, UUID attachmentId) {
        adapterView.deleteAttachmentById(attachmentId);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(AttachmentMessageView.ATTACHMENT_DELETED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
        );
    }

    @Override
    public ResponseEntity<AttachmentApiResponseView> findAttachmentById(String acceptLanguage, UUID attachmentId) {
        return ResponseEntity.status(OK).body(
                new AttachmentApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(AttachmentMessageView.ATTACHMENT_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findAttachmentById(attachmentId)))
        );
    }

    @Override
    public ResponseEntity<AttachmentPageApiResponseView> searchAttachments(String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String filenameFilter, String attachmentTypeName) {
        return ResponseEntity.status(OK).body(
                new AttachmentPageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(AttachmentMessageView.ATTACHMENTS_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchAttachments(filenameFilter, page, size, sortField, sortDirection, attachmentTypeName)))
        );
    }

    @Override
    public ResponseEntity<AttachmentApiResponseView> updateAttachment(String acceptLanguage, UUID attachmentId, AttachmentApiRequestView attachmentApiRequestView) {
        return ResponseEntity.status(OK).body(
                new AttachmentApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(AttachmentMessageView.ATTACHMENT_UPDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.updateAttachment(attachmentId, attachmentApiRequestView)))
        );
    }
}
