package fr.xenonbyte.optifact.backend.application.common.file.port.in;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
public interface SaveFileUsecase {
    String save(byte[] contents, String rootDirectory, String filename);
}
