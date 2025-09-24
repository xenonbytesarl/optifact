package fr.xenonbyte.optifact.backend.infrastructure.config;

import fr.xenonbyte.optifact.backend.application.common.port.out.FrontendUrlProvider;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Hexagonal.SecondaryAdapter
@Component
public class FrontendUrlProviderAdapter implements FrontendUrlProvider {

    @Value("${optifact.frontend.host}")
    private String frontendHost;

    @Value("${optifact.frontend.port}")
    private String frontendPort;

    @Override
    public String baseUrl() {
        String port = (frontendPort == null || frontendPort.isBlank()) ? "" : frontendPort.trim();
        String scheme = "http";
        if ("443".equals(port)) {
            scheme = "https";
        }
        return port.isEmpty() ? String.format("%s://%s", scheme, frontendHost)
                : String.format("%s://%s:%s", scheme, frontendHost, port);
    }
}
