package fr.xenonbyte.optifact.backend.api.common.sequence;

import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.api.common.sequence.generated.SequencesApi;
import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.ApiSuccessResponse;
import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.SequenceApiRequestView;
import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.SequenceApiResponseView;
import fr.xenonbyte.optifact.backend.api.common.sequence.generated.view.SequencePageApiResponseView;
import fr.xenonbyte.optifact.backend.api.common.stock.StockMessageView;
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
public class SequenceResource implements SequencesApi {

    private final SequenceAdapterView adapterView;

    public SequenceResource(SequenceAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<SequenceApiResponseView> createSequence(String acceptLanguage, SequenceApiRequestView sequenceApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new SequenceApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(CREATED.name())
                        .message(MessageUtil.getMessage(StockMessageView.SEQUENCE_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.createSequence(sequenceApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<ApiSuccessResponse> deleteSequence(String acceptLanguage, UUID sequenceId) {
        adapterView.deleteSequenceById(sequenceId);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(StockMessageView.SEQUENCE_DELETED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
        );
    }

    @Override
    public ResponseEntity<SequenceApiResponseView> findSequenceByCode(String acceptLanguage, String code) {
        return ResponseEntity.status(OK).body(
                new SequenceApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(StockMessageView.SEQUENCE_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findSequenceByCode(code)))
        );
    }

    @Override
    public ResponseEntity<SequenceApiResponseView> findSequenceById(String acceptLanguage, java.util.UUID sequenceId) {
        return ResponseEntity.status(OK).body(
                new SequenceApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(StockMessageView.SEQUENCE_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findSequenceById(sequenceId)))
        );
    }

    @Override
    public ResponseEntity<SequencePageApiResponseView> searchSequences(String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String nameFilter, String codeFilter, String prefixFilter, String suffixFilter) {
        return ResponseEntity.status(OK).body(
                new SequencePageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(StockMessageView.SEQUENCES_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchSequences(nameFilter, codeFilter, prefixFilter, suffixFilter, page, size, sortField, sortDirection)))
        );
    }

    @Override
    public ResponseEntity<SequenceApiResponseView> updateSequence(String acceptLanguage, java.util.UUID sequenceId, SequenceApiRequestView sequenceApiRequestView) {
        return ResponseEntity.status(OK).body(
                new SequenceApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(StockMessageView.SEQUENCE_UPDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.updateSequence(sequenceId, sequenceApiRequestView)))
        );
    }
}
