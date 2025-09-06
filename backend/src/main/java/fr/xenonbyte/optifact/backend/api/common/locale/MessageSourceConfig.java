package fr.xenonbyte.optifact.backend.api.common.locale;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

import java.nio.charset.StandardCharsets;

import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.DEFAULTS_PATH;
import static fr.xenonbyte.optifact.backend.api.common.constant.ApiConstant.DEFAULT_BUNDLE_PATH;


@Configuration
public class MessageSourceConfig {

    public MessageSourceConfig() {}

    @Bean
    public static ReloadableResourceBundleMessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasenames(DEFAULT_BUNDLE_PATH, DEFAULTS_PATH);
        messageSource.setDefaultEncoding(StandardCharsets.UTF_8.name());
        messageSource.setCacheSeconds(3600);
        return messageSource;
    }

}
