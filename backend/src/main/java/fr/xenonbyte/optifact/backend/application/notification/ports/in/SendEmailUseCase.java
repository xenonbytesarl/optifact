package fr.xenonbyte.optifact.backend.application.notification.ports.in;

import fr.xenonbyte.optifact.backend.domain.common.vo.EmailAttachment;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;

import java.util.List;
import java.util.Map;


@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface SendEmailUseCase {

    void send(String templateName, Map<String, Object> variables, List<String> to, String subject, EmailServer server);

    void send(String templateName, Map<String, Object> variables, List<String> to, String subject, EmailServer server, List<EmailAttachment> attachments);
}
