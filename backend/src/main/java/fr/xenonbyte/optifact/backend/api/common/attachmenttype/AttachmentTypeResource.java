package fr.xenonbyte.optifact.backend.api.common.attachmenttype;


import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.AttachmentTypesApi;
import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.ApiSuccessResponse;
import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.AttachmentTypeApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.AttachmentTypeApiResponseView;
import fr.xenonbyte.optifact.backend.api.common.attachmenttype.generated.view.AttachmentTypePageApiResponseView;
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

/**
 * @author bamk
 * @version 1.0
 * @since 06/09/2025
 */
@RestController
public class AttachmentTypeResource implements AttachmentTypesApi {

    private final AttachmentTypeAdapterView adapterView;

    public AttachmentTypeResource(AttachmentTypeAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<AttachmentTypeApiResponseView> createAttachmentType(
            String acceptLanguage, AttachmentTypeApiRequestView attachmentTypeApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new AttachmentTypeApiResponseView()
                    .timestamp(ZonedDateTime.now().toString())
                    .success(true)
                    .status(CREATED.name())
                    .message(MessageUtil.getMessage(AttachmentTypeMessageView.ATTACHMENT_TYPE_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                    .data(of(CONTENT, adapterView.createAttachmentType(attachmentTypeApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<ApiSuccessResponse> deleteAttachmentType(String acceptLanguage, UUID attachmentTypeId) {
        adapterView.deleteAttachmentTypeById(attachmentTypeId);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage (AttachmentTypeMessageView.ATTACHMENT_TYPE_DELETED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))

        );
    }

    @Override
    public ResponseEntity<AttachmentTypeApiResponseView> findAttachmentTypeById(String acceptLanguage, UUID attachmentTypeId) {
        return ResponseEntity.status(OK).body(
                new AttachmentTypeApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(AttachmentTypeMessageView.ATTACHMENT_TYPE_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findAttachmentTypeById(attachmentTypeId)))
        );
    }

    @Override
    public ResponseEntity<AttachmentTypePageApiResponseView> searchAttachmentTypes(
            String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String nameFilter) {
        return ResponseEntity.status(OK).body(
                new AttachmentTypePageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(AttachmentTypeMessageView.ATTACHMENT_TYPES_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchAttachmentTypes(nameFilter, page, size, sortField, sortDirection)))
        );
    }

    @Override
    public ResponseEntity<AttachmentTypeApiResponseView> updateAttachmentType(
            String acceptLanguage, UUID attachmentTypeId, AttachmentTypeApiRequestView attachmentTypeApiRequestView) {
        return ResponseEntity.status(OK).body(
                new AttachmentTypeApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(AttachmentTypeMessageView.ATTACHMENT_TYPE_UPDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.updateAttachmentType(attachmentTypeId, attachmentTypeApiRequestView)))
        );
    }
}
