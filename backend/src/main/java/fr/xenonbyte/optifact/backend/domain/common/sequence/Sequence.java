package fr.xenonbyte.optifact.backend.domain.common.sequence;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.entity.BaseEntity;
import fr.xenonbyte.optifact.backend.domain.common.sequence.message.SequenceMessage;

import java.math.BigInteger;
import java.time.ZonedDateTime;
import java.time.temporal.IsoFields;
import java.util.UUID;

import static java.lang.String.format;

/**
 * @author bamk
 * @version 1.0
 * @since 10/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.DOMAIN, componentType = Hexagonal.ComponentType.ENTITY)
@Hexagonal.Entity
public final class Sequence extends BaseEntity {
    public static final String PATTERN_YEAR_WITH_CENTURY="%(year)s";
    public static final String PATTERN_YEAR_WITHOUT_CENTURY="%(y)s";
    public static final String PATTERN_MONTH="%(month)s";
    public static final String PATTERN_DAY_OF_WEEK="%(weekday)s";
    public static final String PATTERN_DAY_OF_MONTH="%(day)s";
    public static final String PATTERN_DAY_OF_YEAR="%(doy)s";
    public static final String PATTERN_WEEK_OF_YEAR="%(woy)s";
    public static final String PATTERN_HOUR_24="%(h24)s";
    public static final String PATTERN_MINUTE="%(min)s";
    public static final String PATTERN_SECOND="%(sec)s";

    private final String name;
    private final String code;
    private final Long step;
    private final Long size;
    private final BigInteger next;
    private final String prefix;
    private final String suffix;
    private final Boolean active;

    public Sequence(UUID id, String name, String code, Long step, Long size, BigInteger next, String prefix,
                    String suffix, Boolean active) {
        this.id = id;
        this.name = name;
        this.code = code;
        this.step = step;
        this.size = size;
        this.next = next;
        this.prefix = prefix;
        this.suffix = suffix;
        this.active = active;
    }

    public static Sequence create(String code, String name, Long step, Long size, BigInteger next, String prefix, String suffix, Boolean active) {

        validateParams(code, name);

        if(step == null) {
            step = 1L;
        }

        if(size == null) {
            size = 5L;
        }

        if(next == null) {
            next = BigInteger.ZERO;
        }

        if(active == null) {
            active = true;
        }

        UUID id = UUID.randomUUID();

        return new Sequence(id, name, code, step, size, next, prefix, suffix, active);
    }

    public static Sequence create(UUID id, String code, String name, Long step, Long size, BigInteger next, String prefix, String suffix, Boolean active) {

        validateParams(code, name);

        if(step == null) {
            step = 1L;
        }

        if(size == null) {
            size = 5L;
        }

        if(next == null) {
            next = BigInteger.ZERO;
        }

        if(active == null) {
            active = true;
        }

        return new Sequence(id, name, code, step, size, next, prefix, suffix, active);
    }


    public Sequence update(String name, String code, Long step, Long size, BigInteger next, String prefix, String suffix, Boolean active) {

        validateParams(code, name);
        validateRequiredFields(step, size, next, active);

        Sequence sequence = new Sequence(this.id, name, code, step, size, next, prefix, suffix, active);

        sequence.updateAudit(this.createdAt);
        return sequence;
    }

    private void validateRequiredFields(Long step, Long size, BigInteger next, Boolean active) {
        if(step == null) {
            throw new IllegalArgumentException(SequenceMessage.SEQUENCE_STEP_REQUIRED);
        }

        if(size == null) {
            throw new IllegalArgumentException(SequenceMessage.SEQUENCE_SIZE_REQUIRED);
        }

        if(next == null) {
            throw new IllegalArgumentException(SequenceMessage.SEQUENCE_NEXT_REQUIRED);
        }

        if(active == null) {
            throw new IllegalArgumentException(SequenceMessage.SEQUENCE_ACTIVE_REQUIRED);
        }
    }

    private static void validateParams(String code, String name) {
        if(code == null || code.isBlank()) {
            throw new IllegalArgumentException(SequenceMessage.SEQUENCE_CODE_REQUIRED);
        }
        if(name == null || name.isBlank()) {
            throw new IllegalArgumentException(SequenceMessage.SEQUENCE_NAME_REQUIRED);
        }
    }

    public String nextNumber() {
        String computedPrefix = computePrefix();
        String computedSuffix = computeSuffix();
        String computedNext = computeNext();
        return (computedPrefix == null ? "" : computedPrefix) + computedNext + (computedSuffix == null ? "" : computedSuffix);
    }

    private String computeNext() {
        return format("%0" + size + "d", next);
    }

    public Sequence incrementNext() {
        BigInteger updatedNext =  next.add(BigInteger.valueOf(step));
        validateRequiredFields(step, size, next, active);
        Sequence sequence = new Sequence(this.id, name, code, step, size, updatedNext, prefix, suffix, active);
        sequence.updateAudit(this.createdAt);
        return sequence;
    }

    private String computeSuffix() {
        if (suffix == null) {
            return null;
        }
        return computePattern(suffix);
    }

    private String computePrefix() {
        if(prefix == null) {
            return null;
        }
        return computePattern(prefix);
    }

    private String computePattern(String pattern) {
        return
                pattern
                    .replace(PATTERN_YEAR_WITH_CENTURY, computeYearWithCentury())
                    .replace(PATTERN_YEAR_WITHOUT_CENTURY, computeYearWithoutCentury())
                    .replace(PATTERN_MONTH, computeMonth())
                    .replace(PATTERN_DAY_OF_WEEK, computeDayOfWeek())
                    .replace(PATTERN_DAY_OF_MONTH, computeDayOfMonth())
                    .replace(PATTERN_DAY_OF_YEAR, computeDayOfYear())
                    .replace(PATTERN_WEEK_OF_YEAR, computeWeekOfYear())
                    .replace(PATTERN_HOUR_24, computeHour24())
                    .replace(PATTERN_MINUTE, computeMinute())
                    .replace(PATTERN_SECOND, computeSecond());
    }

    private String computeYearWithCentury() {
        return String.valueOf(ZonedDateTime.now().getYear());
    }

    private String computeYearWithoutCentury() {
        return String.valueOf(ZonedDateTime.now().getYear() % 100);
    }

    private String computeMonth() {
        return format("%02d", ZonedDateTime.now().getMonthValue());    }

    private String computeDayOfWeek() {
        return format("%02d", ZonedDateTime.now().getDayOfWeek().getValue());
    }

    private String computeDayOfMonth() {
        return format("%02d", ZonedDateTime.now().getDayOfMonth());
    }

    private String computeDayOfYear() {
        return format("%03d", ZonedDateTime.now().getDayOfYear());
    }

    private String computeWeekOfYear() {
        return format("%02d", ZonedDateTime.now().get(IsoFields.WEEK_OF_WEEK_BASED_YEAR));
    }

    private String computeHour24() {
        return format("%02d", ZonedDateTime.now().getHour());
    }

    private String computeMinute() {
        return format("%02d", ZonedDateTime.now().getMinute());
    }

    private String computeSecond() {
        return format("%02d", ZonedDateTime.now().getSecond());
    }

    public String getName() {
        return name;
    }

    public String getCode() {
        return code;
    }

    public Long getStep() {
        return step;
    }

    public Long getSize() {
        return size;
    }

    public BigInteger getNext() {
        return next;
    }

    public String getPrefix() {
        return prefix;
    }

    public String getSuffix() {
        return suffix;
    }

    public Boolean getActive() {
        return active;
    }
}
