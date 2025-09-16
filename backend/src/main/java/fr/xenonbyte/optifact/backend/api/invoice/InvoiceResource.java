package fr.xenonbyte.optifact.backend.api.invoice;

import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.api.invoice.generated.InvoicesApi;
import fr.xenonbyte.optifact.backend.api.invoice.generated.view.ApiSuccessResponse;
import fr.xenonbyte.optifact.backend.api.invoice.generated.view.InvoiceApiRequestView;
import fr.xenonbyte.optifact.backend.api.invoice.generated.view.InvoiceApiResponseView;
import fr.xenonbyte.optifact.backend.api.invoice.generated.view.InvoicePageApiResponseView;
import fr.xenonbyte.optifact.backend.api.invoice.generated.view.InvoiceStateView;
import fr.xenonbyte.optifact.backend.api.invoice.generated.view.UpdateInvoiceApiRequestView;
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
public class InvoiceResource implements InvoicesApi {

    private final InvoiceAdapterView adapterView;

    public InvoiceResource(InvoiceAdapterView adapterView) {
        this.adapterView = adapterView;
    }

    @Override
    public ResponseEntity<InvoiceApiResponseView> createInvoice(String acceptLanguage, InvoiceApiRequestView invoiceApiRequestView) {
        return ResponseEntity.status(CREATED).body(
                new InvoiceApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(CREATED.name())
                        .message(MessageUtil.getMessage(InvoiceMessageView.INVOICE_CREATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.createInvoice(invoiceApiRequestView)))
        );
    }

    @Override
    public ResponseEntity<ApiSuccessResponse> deleteInvoice(String acceptLanguage, UUID invoiceId) {
        adapterView.deleteInvoiceById(invoiceId);
        return ResponseEntity.status(OK).body(
                new ApiSuccessResponse()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(InvoiceMessageView.INVOICE_DELETED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
        );
    }

    @Override
    public ResponseEntity<InvoiceApiResponseView> findInvoiceById(String acceptLanguage, UUID invoiceId) {
        return ResponseEntity.status(OK).body(
                new InvoiceApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(InvoiceMessageView.INVOICE_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.findInvoiceById(invoiceId)))
        );
    }

    @Override
    public ResponseEntity<InvoicePageApiResponseView> searchInvoices(String acceptLanguage, Integer page, Integer size, String sortField, String sortDirection, String referenceFilter, String actorName, String claimName, InvoiceStateView stateFilter) {
        return ResponseEntity.status(OK).body(
                new InvoicePageApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(InvoiceMessageView.INVOICES_FOUND_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.searchInvoices(referenceFilter, page, size, sortField, sortDirection, actorName, claimName, stateFilter)))
        );
    }

    @Override
    public ResponseEntity<InvoiceApiResponseView> updateInvoice(String acceptLanguage, UUID invoiceId, UpdateInvoiceApiRequestView updateInvoiceApiRequestView) {
        return ResponseEntity.status(OK).body(
                new InvoiceApiResponseView()
                        .timestamp(ZonedDateTime.now().toString())
                        .success(true)
                        .status(OK.name())
                        .message(MessageUtil.getMessage(InvoiceMessageView.INVOICE_UPDATED_SUCCESSFULLY, Locale.forLanguageTag(acceptLanguage), ""))
                        .data(of(CONTENT, adapterView.updateInvoice(invoiceId, updateInvoiceApiRequestView)))
        );
    }
}
