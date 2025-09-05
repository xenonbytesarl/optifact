package fr.xenonbyte.optifact.backend.domain.common.annotation;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE, ElementType.PACKAGE})
public @interface Hexagonal {


    Layer layer() default Layer.DOMAIN;


    ComponentType componentType() default ComponentType.NONE;


    enum Layer {

        DOMAIN,


        APPLICATION,


        ADAPTER,


        INFRASTRUCTURE
    }


    enum ComponentType {

        NONE,


        ENTITY,


        VALUE_OBJECT,


        AGGREGATE,


        REPOSITORY,


        DOMAIN_SERVICE,


        APPLICATION_SERVICE,


        FACTORY,


        DOMAIN_EVENT,


        EVENT_PUBLISHER,


        EVENT_LISTENER,


        PRIMARY_PORT,


        SECONDARY_PORT,


        PRIMARY_ADAPTER,


        SECONDARY_ADAPTER
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface Entity {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface ValueObject {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface Aggregate {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface Repository {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface DomainService {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface ApplicationService {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface Factory {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface DomainEvent {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface EventPublisher {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface EventListener {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface PrimaryPort {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface SecondaryPort {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface PrimaryAdapter {

        String value() default "";
    }


    @Documented
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @interface SecondaryAdapter {

        AdapterType value() default AdapterType.NONE;

        enum AdapterType {
            NONE,
            DATABASE_IN_MEMORY,
            DATABASE_JPA_POSTGRES,
            MESSAGE_KAFKA,
            MESSAGE_IN_MEMORY
        }
    }
}
