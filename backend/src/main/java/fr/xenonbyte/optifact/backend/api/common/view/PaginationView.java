package fr.xenonbyte.optifact.backend.api.common.view;

import java.math.BigInteger;
import java.util.List;


public record PaginationView<T>(
        Long page,
        Long size,
        Boolean isFirst,
        Boolean isLast,
        BigInteger totalElements,
        Long totalPages,
        List<T> elements
) {

    public static <T> PaginationView<T> of(Long page, Long size, BigInteger totalElements, List<T> elements) {
        Long totalPages = computeTotalPages(size, totalElements);
        Boolean isFirst = page == 0;
        Boolean isLast = page >= totalPages - 1;
        
        return new PaginationView<>(page, size, isFirst, isLast, totalElements, totalPages, elements);
    }
    
    private static Long computeTotalPages(Long size, BigInteger totalElements) {
        if (totalElements.equals(BigInteger.ZERO)) {
            return 1L;
        }
        // Convert to double for division and ceiling, then back to Long
        double totalElementsDouble = totalElements.doubleValue();
        return (long) Math.ceil(totalElementsDouble / size);
    }
}