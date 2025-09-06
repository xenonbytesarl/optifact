package fr.xenonbyte.optifact.backend.api.common.view;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.time.ZonedDateTime;

import static fr.xenonbyte.optifact.backend.api.common.message.CommonApiMessage.COMMON_NOT_BLANK;
import static fr.xenonbyte.optifact.backend.api.common.message.CommonApiMessage.COMMON_NOT_NULL;


@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ResponseView {
    @NotBlank(message = COMMON_NOT_BLANK)
    protected ZonedDateTime timestamp;
    @NotNull(message = COMMON_NOT_NULL)
    protected Integer code;
    @NotBlank(message = COMMON_NOT_BLANK)
    protected String status;
    @NotNull(message = COMMON_NOT_NULL)
    protected Boolean success;
}
