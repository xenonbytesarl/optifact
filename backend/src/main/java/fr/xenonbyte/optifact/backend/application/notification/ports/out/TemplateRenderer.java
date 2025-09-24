package fr.xenonbyte.optifact.backend.application.notification.ports.out;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.util.Map;


@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.SECONDARY_PORT)
@Hexagonal.SecondaryPort
public interface TemplateRenderer {

    String render(String templateName, Map<String, Object> variables);
}
