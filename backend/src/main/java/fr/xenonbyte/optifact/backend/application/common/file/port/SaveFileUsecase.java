package fr.xenonbyte.optifact.backend.application.common.file.port;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.PRIMARY_PORT)
@Hexagonal.PrimaryPort
public interface SaveFileUsecase {
    String save(byte[] contents, String rootDirectory, String filename);
}
