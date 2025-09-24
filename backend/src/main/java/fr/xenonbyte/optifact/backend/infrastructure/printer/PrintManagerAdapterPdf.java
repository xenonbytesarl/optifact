package fr.xenonbyte.optifact.backend.infrastructure.printer;

import fr.xenonbyte.optifact.backend.application.printer.port.in.PrintManagerUseCase;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 24/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter
public final class PrintManagerAdapterPdf implements PrintManagerUseCase {

    private static final Logger LOGGER = Logger.getLogger(PrintManagerAdapterPdf.class.getName());

    private final TemplateEngine templateEngine;

    public PrintManagerAdapterPdf() {
        // Configure a template resolver to load templates from classpath resources
        ClassLoaderTemplateResolver resolver = new ClassLoaderTemplateResolver();
        resolver.setPrefix("templates/");
        resolver.setSuffix(".html");
        resolver.setTemplateMode("XHTML");
        resolver.setCharacterEncoding(StandardCharsets.UTF_8.name());
        resolver.setCacheable(true);

        this.templateEngine = new TemplateEngine();
        this.templateEngine.setTemplateResolver(resolver);
    }

    @Override
    public byte[] print(Object data, String template) {
        Objects.requireNonNull(template, "template must not be null");
        try {
            // Prepare Thymeleaf context
            Context context = new Context(Locale.getDefault());
            if (data instanceof Map<?, ?> map) {
                //noinspection unchecked
                context.setVariables((Map<String, Object>) map);
            } else if (data != null) {
                // Put the object under a conventional key so templates can reference it
                context.setVariable("data", data);
            }

            // Accept both full paths like "stock/stock-picking" or plain name; remove .html if passed
            String normalizedTemplate = normalizeTemplateName(template);

            String html = templateEngine.process(normalizedTemplate, context);

            // Convert HTML to PDF using Flying Saucer (iTextRenderer)
            try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
                ITextRenderer renderer = new ITextRenderer();
                // Base URL to resolve relative resources (CSS, images) from the classpath
                String baseUrl = Objects.requireNonNull(
                        getClass().getClassLoader().getResource("templates/")
                ).toExternalForm();
                renderer.setDocumentFromString(html, baseUrl);
                renderer.layout();
                renderer.createPDF(baos);
                renderer.finishPDF();
                return baos.toByteArray();
            }
        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "Failed to generate PDF from template: " + template, e);
            // Return empty PDF bytes on failure to avoid nulls; caller can handle empty
            return new byte[0];
        }
    }

    private String normalizeTemplateName(String template) {
        String t = template.trim();
        if (t.endsWith(".html")) t = t.substring(0, t.length() - 5);
        // If the template already starts with "templates/", strip it because resolver adds prefix
        if (t.startsWith("templates/")) {
            t = t.substring("templates/".length());
        }
        return t;
    }
}
