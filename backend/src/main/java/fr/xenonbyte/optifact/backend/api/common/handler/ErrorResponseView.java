package fr.xenonbyte.optifact.backend.api.common.handler;



import fr.xenonbyte.optifact.backend.api.common.view.ResponseView;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

import java.util.List;
import java.util.UUID;

import static fr.xenonbyte.optifact.backend.api.common.message.CommonApiMessage.COMMON_NOT_BLANK;


@Getter
@Setter
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ErrorResponseView extends ResponseView {
        @NotBlank(message = COMMON_NOT_BLANK)
        private String reason;
        @NotBlank(message = COMMON_NOT_BLANK)
        private String path;
        private UUID correlationId;
        private List<ErrorView> error;
}
