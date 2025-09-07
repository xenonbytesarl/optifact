package fr.xenonbyte.optifact.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Configuration
public class SwaggerUIConfig implements WebMvcConfigurer {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Optifact REST API")
                        .version("1.0")
                        .description("API documentation for Optifact application"));
    }
}
