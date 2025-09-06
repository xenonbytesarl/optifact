package fr.xenonbyte.optifact.backend.api.common.view;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.Map;

import static fr.xenonbyte.optifact.backend.api.common.message.CommonApiMessage.COMMON_NOT_BLANK;
import static fr.xenonbyte.optifact.backend.api.common.message.CommonApiMessage.COMMON_NOT_NULL;


@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public final class SuccessResponseView extends ResponseView {
    @NotBlank(message = COMMON_NOT_BLANK)
    private String message;
    @NotNull(message = COMMON_NOT_NULL)
    private Map<String, Object> data;
}
