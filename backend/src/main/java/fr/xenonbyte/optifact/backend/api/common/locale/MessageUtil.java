package fr.xenonbyte.optifact.backend.api.common.locale;

import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Locale;


@Component
public final class MessageUtil {

    private MessageUtil() {}

    public static String getMessage(String message, String... dynamicValues) {
        return MessageSourceConfig.messageSource().getMessage(message, dynamicValues, LocaleContextHolder.getLocale());
    }

    public static String getMessage(String message, Locale locale, String... dynamicValues) {
        return MessageSourceConfig.messageSource().getMessage(message, dynamicValues, locale);
    }

    public static String[] toStringArray(Object[] args) {
        return args ==null? new String[]{} : Arrays.stream(args).map(Object::toString).toArray(String[]::new);
    }
}
