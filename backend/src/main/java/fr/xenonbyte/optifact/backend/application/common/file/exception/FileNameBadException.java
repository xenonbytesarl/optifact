package fr.xenonbyte.optifact.backend.application.common.file.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.BadException;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
public final class FileNameBadException extends BadException {
    public FileNameBadException(String path) {
        super("file.bad.name", path);
    }
}
