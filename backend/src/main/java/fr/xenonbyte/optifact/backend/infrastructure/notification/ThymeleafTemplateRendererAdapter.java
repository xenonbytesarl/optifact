package fr.xenonbyte.optifact.backend.infrastructure.notification;

import fr.xenonbyte.optifact.backend.application.notification.ports.out.TemplateRenderer;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.stereotype.Component;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Locale;
import java.util.Map;
import java.util.Objects;

@Component
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
public class ThymeleafTemplateRendererAdapter implements TemplateRenderer {

    private final SpringTemplateEngine templateEngine;

    public ThymeleafTemplateRendererAdapter(SpringTemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Override
    public String render(String templateName, Map<String, Object> variables) {
        if (templateName == null || templateName.isBlank()) {
            throw new IllegalArgumentException("templateName must not be blank");
        }
        // Thymeleaf expects logical name without extension by default.
        String logicalName = normalizeTemplateName(templateName);
        Context context = new Context(Locale.getDefault());
        if (variables != null) {
            variables.forEach(context::setVariable);
        }
        return templateEngine.process(logicalName, context);
    }

    private String normalizeTemplateName(String name) {
        String n = Objects.requireNonNull(name, "name").trim();
        if (n.endsWith(".html")) {
            n = n.substring(0, n.length() - 5);
        }
        if (n.startsWith("/")) {
            n = n.substring(1);
        }
        return n;
    }
}
