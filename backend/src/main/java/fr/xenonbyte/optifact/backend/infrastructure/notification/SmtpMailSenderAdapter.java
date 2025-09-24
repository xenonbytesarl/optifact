package fr.xenonbyte.optifact.backend.infrastructure.notification;

import fr.xenonbyte.optifact.backend.application.notification.ports.out.MailSender;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Properties;
import java.util.logging.Logger;

/**
 * SMTP implementation of MailSender using Spring's JavaMailSenderImpl.
 */
@Component
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
public class SmtpMailSenderAdapter implements MailSender {

    private static final Logger LOGGER = Logger.getLogger(SmtpMailSenderAdapter.class.getName());

    @Override
    public void send(EmailServer server, List<String> to, String subject, String body) {
        if (server == null) throw new IllegalArgumentException("Email server must not be null");
        if (to == null || to.isEmpty()) throw new IllegalArgumentException("Recipients list must not be empty");

        JavaMailSenderImpl sender = buildSender(server);
        MimeMessage message = sender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED, StandardCharsets.UTF_8.name());
            String from = server.getFrom() != null && !server.getFrom().isBlank() ? server.getFrom() : server.getUsername();
            helper.setFrom(from);
            helper.setTo(to.toArray(new String[0]));
            helper.setSubject(subject == null ? "" : subject);
            helper.setText(body == null ? "" : body, true); // HTML
        } catch (MessagingException e) {
            throw new IllegalStateException("Failed to build email message", e);
        }

        LOGGER.info("Sending email via host '" + server.getHost() + "' on port " + server.getPort());
        sender.send(message);
    }

    private JavaMailSenderImpl buildSender(EmailServer server) {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost(server.getHost());
        if (server.getPort() != null) {
            mailSender.setPort(server.getPort());
        }
        mailSender.setUsername(server.getUsername());
        mailSender.setPassword(server.getPassword());

        Properties props = mailSender.getJavaMailProperties();
        String protocol = server.getProtocol() != null ? server.getProtocol() : "smtp";
        props.put("mail.transport.protocol", protocol);
        boolean useAuth = Boolean.TRUE.equals(server.getUseAuth());
        boolean useTls = Boolean.TRUE.equals(server.getUseTLS());
        props.put("mail.smtp.auth", String.valueOf(useAuth));
        props.put("mail.smtp.starttls.enable", String.valueOf(useTls));
        // Trust all hosts when TLS is enabled; adjust as needed for stricter security
        if (useTls) {
            props.put("mail.smtp.ssl.trust", server.getHost());
        }
        // Timeouts
        props.put("mail.smtp.connectiontimeout", "10000");
        props.put("mail.smtp.timeout", "15000");
        props.put("mail.smtp.writetimeout", "15000");
        return mailSender;
    }
}
