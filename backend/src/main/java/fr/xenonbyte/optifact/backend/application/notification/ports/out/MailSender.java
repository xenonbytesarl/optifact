package fr.xenonbyte.optifact.backend.application.notification.ports.out;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;

import java.util.List;


@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.SecondaryPort
public interface MailSender {


    void send(EmailServer server, List<String> to, String subject, String body);
}
