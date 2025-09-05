package fr.xenonbyte.optifact.backend.application.common.payload;

import java.util.List;

/**
 * @author bamk
 * @version 1.0
 * @since 05/09/2025
 */
public record Pagination<T>(List<T> elements, Long totalPages, Long totalElements,
                            Long page, Long size, Boolean last, Boolean first) {

    public static <T> Pagination<T> create(List<T> elements, Integer totalPages, Long totalElements, Long page, Long size, Boolean last, Boolean first) {
        return new Pagination<>(elements, totalPages.longValue(), totalElements, page, size, last, first);
    }
}
