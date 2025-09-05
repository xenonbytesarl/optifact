package fr.xenonbyte.optifact.backend;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(
        scanBasePackages = {"fr.xenonbyte.optifact"}
)
@ComponentScan(
        basePackages = {"fr.xenonbyte.optifact"},
        includeFilters = {
                @ComponentScan.Filter(type = FilterType.ANNOTATION, value = {
                        Hexagonal.PrimaryAdapter.class,
                        Hexagonal.SecondaryAdapter.class,
                        Hexagonal.Factory.class,
                        Hexagonal.ApplicationService.class
                })
        }
)
@EnableJpaRepositories(
        basePackages = {"fr.xenonbyte.optifact"}
)
@EntityScan(
        basePackages = {"fr.xenonbyte.optifact"}
)
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
