package fr.xenonbyte.optifact.backend.application.common.port.out;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

@Hexagonal.SecondaryPort
public interface FrontendUrlProvider {
    String baseUrl();
}
