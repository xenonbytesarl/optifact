package fr.xenonbyte.optifact.backend.api.common.handler;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static fr.xenonbyte.optifact.backend.api.common.message.CommonApiMessage.COMMON_NOT_BLANK;


@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorView {

    @NotBlank(message = COMMON_NOT_BLANK)
    private String field;
    @NotBlank(message = COMMON_NOT_BLANK)
    private String message;
}
