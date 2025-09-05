package fr.xenonbyte.optifact.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import static java.util.List.of;


@Configuration
public class CorsConfig {

    @Value("${optifact.frontend.host}")
    private String host;

    @Value("${optifact.frontend.port}")
    private String port;

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource urlBasedCorsConfigurationSource = new UrlBasedCorsConfigurationSource();
        CorsConfiguration corsConfiguration = new CorsConfiguration();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.setAllowedOrigins(of(String.format("http://%s:%s", host, port), String.format("https://%s:%s", host, port)));
        corsConfiguration.setAllowedHeaders(of("Origin", "Content-Type", "Access-Control-Allow-Origin", "Accept-Language",
                "Jwt-Token", "Authorization", "Accept", "X-Requested-With", "Access-Control-Request-Method", "Content-Disposition",
                "Access-Control-Request-Headers"));
        corsConfiguration.setExposedHeaders(of("Origin", "Content-Type", "Accept", "Jwt-Token", "Authorization", "Accept-Language",
                "Access-Control-Allow-Origin", "Access-Control-Allow-Credentials", "File-Name", "Content-Disposition"));
        corsConfiguration.setAllowedMethods(of("GET", "POST", "OPTIONS", "PUT", "DELETE", "PATCH"));
        urlBasedCorsConfigurationSource.registerCorsConfiguration("/**", corsConfiguration);
        return new CorsFilter(urlBasedCorsConfigurationSource);
    }

}
