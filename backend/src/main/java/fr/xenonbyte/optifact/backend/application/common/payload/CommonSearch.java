package fr.xenonbyte.optifact.backend.application.common.payload;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
public record CommonSearch(Long page, Long size, String sort, String direction) {}
