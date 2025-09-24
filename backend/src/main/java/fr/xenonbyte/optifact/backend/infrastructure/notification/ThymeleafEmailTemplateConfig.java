package fr.xenonbyte.optifact.backend.infrastructure.notification;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.thymeleaf.templatemode.TemplateMode;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

import java.nio.charset.StandardCharsets;

/**
 * Ensures Thymeleaf can resolve templates packaged inside the fat JAR when running in Docker.
 * Defaults to classpath:/templates/ with .html suffix, matching Spring Boot conventions.
 */
@Configuration
public class ThymeleafEmailTemplateConfig {

    @Bean
    public ITemplateResolver emailTemplateResolver() {
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        // Use classloader (works inside fat JAR) and point to resources/templates/
        resolver.setPrefix("templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode(TemplateMode.HTML);
        resolver.setCharacterEncoding(StandardCharsets.UTF_8.name());
        resolver.setCheckExistence(true);
        resolver.setOrder(1); // high priority
        resolver.setCacheable(true); // cache in prod
        return resolver;
    }
}
