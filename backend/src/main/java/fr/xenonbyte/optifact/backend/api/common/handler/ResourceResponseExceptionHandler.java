package fr.xenonbyte.optifact.backend.api.common.handler;


import fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil;
import fr.xenonbyte.optifact.backend.application.common.exception.BadException;
import fr.xenonbyte.optifact.backend.application.common.exception.ConflictException;
import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;
import fr.xenonbyte.optifact.backend.application.common.exception.TechnicalException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.UUID;

import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.PATH_URI_REPLACE;
import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.SUCCESS_FALSE;
import static fr.xenonbyte.optifact.backend.api.common.locale.MessageUtil.getMessage;
import static fr.xenonbyte.optifact.backend.api.common.message.CommonApiMessage.UNEXPECTED_ERROR_OCCURRED_WHEN_PROCESSING_REQUEST;
import static fr.xenonbyte.optifact.backend.api.common.message.CommonApiMessage.VALIDATION_ERROR_OCCURRED_WHEN_PROCESSING_REQUEST;
import static java.time.ZonedDateTime.now;
import static java.util.Objects.requireNonNull;
import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.CONFLICT;
import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;
import static org.springframework.http.HttpStatus.NOT_FOUND;
import static org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE;


@Slf4j
@RestControllerAdvice
public class ResourceResponseExceptionHandler extends ResponseEntityExceptionHandler {

    public static final String ACCEPT_LANGUAGE = "Accept-Language";

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException exception, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        String locale = requireNonNull(request.getHeader(ACCEPT_LANGUAGE));
        List<ErrorView> errors = new ArrayList<>();
        exception.getBindingResult().getFieldErrors()
                .forEach(fieldError -> {
                    String message = String.format(
                            "%s.%s.%s", StringUtils.capitalize(fieldError.getObjectName()), fieldError.getField().replaceAll("\\[\\d+]",""), fieldError.getCode());
                    if(errors.stream().noneMatch(error -> error.getField().equals(fieldError.getField()))) {
                        errors.add(
                                ErrorView.builder()
                                        .field(fieldError.getField())
                                        .message(getMessage(requireNonNull(message), Locale.forLanguageTag(locale), ""))
                                        .build()
                        );
                    }
                });
        log.error("", exception);
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(
                        ErrorResponseView.builder()
                                .timestamp(now())
                                .code(BAD_REQUEST.value())
                                .status(BAD_REQUEST.name())
                                .success(SUCCESS_FALSE)
                                .reason(getMessage(VALIDATION_ERROR_OCCURRED_WHEN_PROCESSING_REQUEST, Locale.forLanguageTag(locale), ""))
                                .path(request.getDescription(SUCCESS_FALSE).replace(PATH_URI_REPLACE,  ""))
                                .error(errors)
                                .build()
                );
    }

    @Override
    protected ResponseEntity<Object> handleMissingServletRequestParameter(
            MissingServletRequestParameterException exception, HttpHeaders headers, HttpStatusCode status, WebRequest request) {
        log.error("", exception);
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(
                        ErrorResponseView.builder()
                                .timestamp(now())
                                .code(BAD_REQUEST.value())
                                .status(BAD_REQUEST.name())
                                .success(SUCCESS_FALSE)
                                .reason(getMessage(exception.getLocalizedMessage(), request.getHeader(ACCEPT_LANGUAGE), ""))
                                .path(request.getDescription(SUCCESS_FALSE).replace(PATH_URI_REPLACE, ""))
                                .build()
                );
    }

    @ExceptionHandler({IllegalArgumentException.class})
    protected ResponseEntity<ErrorResponseView> handleIllegalArgumentException
            (RuntimeException exception, WebRequest request, Locale locale) {
        log.error("", exception);
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(
                        ErrorResponseView.builder()
                                .timestamp(now())
                                .code(BAD_REQUEST.value())
                                .status(BAD_REQUEST.name())
                                .success(SUCCESS_FALSE)
                                .reason(getMessage(exception.getLocalizedMessage(), locale, ""))
                                .path(request.getDescription(SUCCESS_FALSE).replace(PATH_URI_REPLACE, ""))
                                .build()
                );
    }

    @ExceptionHandler({BadException.class})
    protected ResponseEntity<ErrorResponseView> handleBadException
            (BadException exception, WebRequest request) {
        log.error("", exception);
        return ResponseEntity
                .status(BAD_REQUEST)
                .body(
                        ErrorResponseView.builder()
                                .timestamp(now())
                                .code(BAD_REQUEST.value())
                                .status(BAD_REQUEST.name())
                                .success(false)
                                .reason(getMessage(exception.getLocalizedMessage(), MessageUtil.toStringArray(exception.getArgs()) ))
                                .path(request.getDescription(false).replace(PATH_URI_REPLACE, ""))
                                .build()

                );
    }

    @ExceptionHandler({NotFoundException.class})
    protected ResponseEntity<ErrorResponseView> handleNotFoundException
            (NotFoundException exception, WebRequest request) {
        log.error("", exception);
        return ResponseEntity
                .status(NOT_FOUND)
                .body(
                        ErrorResponseView.builder()
                                .timestamp(now())
                                .code(NOT_FOUND.value())
                                .status(NOT_FOUND.name())
                                .success(false)
                                .reason(getMessage(exception.getLocalizedMessage(), MessageUtil.toStringArray(exception.getArgs()) ))
                                .path(request.getDescription(false).replace(PATH_URI_REPLACE, ""))
                                .build()

                );
    }

    @ExceptionHandler({ConflictException.class})
    protected ResponseEntity<ErrorResponseView> handleConflictException
            (ConflictException exception, WebRequest request) {
        log.error("", exception);
        return ResponseEntity
                .status(CONFLICT)
                .body(
                        ErrorResponseView.builder()
                                .timestamp(now())
                                .code(CONFLICT.value())
                                .status(CONFLICT.name())
                                .success(false)
                                .reason(getMessage(exception.getLocalizedMessage(), MessageUtil.toStringArray(exception.getArgs()) ))
                                .path(request.getDescription(false).replace(PATH_URI_REPLACE, ""))
                                .build()

                );
    }

    @ExceptionHandler({TechnicalException.class})
    protected ResponseEntity<ErrorResponseView> handleTechnicalException
            (TechnicalException exception, WebRequest request) {
        log.error("", exception);
        return ResponseEntity
                .status(SERVICE_UNAVAILABLE)
                .body(
                        ErrorResponseView.builder()
                                .timestamp(now())
                                .code(SERVICE_UNAVAILABLE.value())
                                .status(SERVICE_UNAVAILABLE.name())
                                .success(false)
                                .correlationId(UUID.randomUUID())
                                .reason(getMessage(exception.getLocalizedMessage(), MessageUtil.toStringArray(exception.getArgs()) ))
                                .path(request.getDescription(false).replace(PATH_URI_REPLACE, ""))
                                .build()
                );
    }

    @ExceptionHandler({Exception.class})
    protected ResponseEntity<ErrorResponseView> handleException(Exception exception, WebRequest request, Locale locale ) {
        log.error("", exception);
        return ResponseEntity
                .status(INTERNAL_SERVER_ERROR)
                .body(
                        ErrorResponseView.builder()
                                .timestamp(now())
                                .code(INTERNAL_SERVER_ERROR.value())
                                .status(INTERNAL_SERVER_ERROR.name())
                                .success(SUCCESS_FALSE)
                                .correlationId(UUID.randomUUID())
                                .reason(getMessage(UNEXPECTED_ERROR_OCCURRED_WHEN_PROCESSING_REQUEST, locale, ""))
                                .path(request.getDescription(SUCCESS_FALSE).replace(PATH_URI_REPLACE, ""))
                                .build()
                );
    }

}
