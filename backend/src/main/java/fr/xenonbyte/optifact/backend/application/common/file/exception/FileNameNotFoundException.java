package fr.xenonbyte.optifact.backend.application.common.file.exception;

import fr.xenonbyte.optifact.backend.application.common.exception.NotFoundException;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
public final class FileNameNotFoundException extends NotFoundException {
    public FileNameNotFoundException(String path) {
        super("file.not.found", path);
    }
}
