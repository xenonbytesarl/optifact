package fr.xenonbyte.optifact.backend.application.notification;

import fr.xenonbyte.optifact.backend.application.notification.ports.in.SendEmailUseCase;
import fr.xenonbyte.optifact.backend.domain.common.vo.EmailAttachment;
import fr.xenonbyte.optifact.backend.application.notification.ports.out.MailSender;
import fr.xenonbyte.optifact.backend.application.notification.ports.out.TemplateRenderer;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;

import java.io.InputStream;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.logging.Logger;

/**
 * Application service that renders a template and sends the email using the given server configuration.
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SendEmailApplicationService implements SendEmailUseCase {

    private static final Logger LOGGER = Logger.getLogger(SendEmailApplicationService.class.getName());

    private final TemplateRenderer templateRenderer;
    private final MailSender mailSender;

    public SendEmailApplicationService(TemplateRenderer templateRenderer, MailSender mailSender) {
        this.templateRenderer = templateRenderer;
        this.mailSender = mailSender;
    }

    @Override
    public void send(String templateName, Map<String, Object> variables, List<String> to, String subject, EmailServer server) {
        send(templateName, variables, to, subject, server, List.of());
    }

    @Override
    public void send(String templateName, Map<String, Object> variables, List<String> to, String subject, EmailServer server, List<EmailAttachment> attachments) {
        // Basic validations
        if (server == null) throw new IllegalArgumentException("Email server must not be null");
        if (templateName == null || templateName.isBlank()) throw new IllegalArgumentException("templateName must not be blank");
        if (to == null || to.isEmpty() || to.stream().anyMatch(Objects::isNull)) throw new IllegalArgumentException("Recipients list 'to' must not be empty or contain null");
        if (subject == null) subject = ""; // allow empty subject

        // Make a mutable copy of variables and enrich with inline logo if missing
        Map<String, Object> model = (variables == null) ? new HashMap<>() : new HashMap<>(variables);
        ensureInlineLogo(model);

        LOGGER.info("Rendering email template '" + templateName + "' for " + to.size() + " recipient(s)");
        String body = templateRenderer.render(templateName, model);

        LOGGER.info("Sending email to " + to + " using server host '" + server.getHost() + "' and user '" + server.getUsername() + "' with " + (attachments == null ? 0 : attachments.size()) + " attachment(s)");
        mailSender.send(server, to, subject, body, attachments == null ? List.of() : attachments);
        LOGGER.info("Email sent successfully");
    }

    private void ensureInlineLogo(Map<String, Object> variables) {
        if (variables.containsKey("logoUrl") && variables.get("logoUrl") != null) {
            return; // Respect explicit logoUrl provided by caller
        }
        // Try common logo locations under classpath static resources
        String[] candidates = new String[] {
                "static/images/logo.png",
                "public/images/logo.png",
                "images/logo.png"
        };
        ClassLoader cl = Thread.currentThread().getContextClassLoader();
        if (cl == null) cl = SendEmailApplicationService.class.getClassLoader();
        for (String path : candidates) {
            try (InputStream is = cl.getResourceAsStream(path)) {
                if (is != null) {
                    byte[] bytes = is.readAllBytes();
                    String base64 = Base64.getEncoder().encodeToString(bytes);
                    String dataUri = "data:image/png;base64," + base64;
                    variables.put("logoUrl", dataUri);
                    return;
                }
            } catch (Exception ignored) {
                // Fall through to next candidate; do not fail sending
            }
        }
        // As a minimal fallback, embed a small 1x1 transparent PNG to avoid broken image icons
        try {
            String transparent1px = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y1kV0cAAAAASUVORK5CYII=";
            variables.put("logoUrl", "data:image/png;base64," + transparent1px);
        } catch (Exception ignored) {
        }
    }
}
