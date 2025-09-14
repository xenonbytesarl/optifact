package fr.xenonbyte.optifact.backend.application.common.file.port.in;

import fr.xenonbyte.optifact.backend.application.common.exception.TechnicalException;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermission;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 14/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SaveFileApplicationService implements SaveFileUsecase {

    private static final Logger LOGGER = Logger.getLogger(SaveFileApplicationService.class.getName());

    @Override
    public String save(byte[] contents, String rootDirectory, String filename) {
        try {
            // Convert directory string to Path
            Path targetPath = createNewFile(rootDirectory, filename, contents);

            // Return the full path as a string
            return targetPath.toString();
        } catch (IOException e) {
            throw new TechnicalException(e.getMessage(), e);
        }
    }


    private static Path createNewFile(String directory, String filename, byte[] contents) throws IOException {
        // Convert directory string to Path
        Path directoryPath = Path.of(directory);

        // Create a directory if it doesn't exist
        createDirectory(directoryPath);

        // Generate a unique filename to avoid conflicts
        String uniqueFilename = String.format("%s_%s", UUID.randomUUID(), filename);

        // Create the target path
        Path targetPath = directoryPath.resolve(uniqueFilename);

        // Write the file contents to the target location
        Files.write(targetPath, contents);

        LOGGER.info("Target file path: " + targetPath);
        return targetPath;
    }

    private static void createDirectory(Path directoryPath) throws IOException {
        // Create a directory if it doesn't exist
        if (!Files.exists(directoryPath)) {
            Files.createDirectories(directoryPath);

            // Set permissions to allow everyone to read, write, and execute
            Set<PosixFilePermission> permissions = new HashSet<>();
            // Owner permissions
            permissions.add(PosixFilePermission.OWNER_READ);
            permissions.add(PosixFilePermission.OWNER_WRITE);
            permissions.add(PosixFilePermission.OWNER_EXECUTE);
            // Group permissions
            permissions.add(PosixFilePermission.GROUP_READ);
            permissions.add(PosixFilePermission.GROUP_WRITE);
            permissions.add(PosixFilePermission.GROUP_EXECUTE);
            // Other's permissions
            permissions.add(PosixFilePermission.OTHERS_READ);
            permissions.add(PosixFilePermission.OTHERS_WRITE);
            permissions.add(PosixFilePermission.OTHERS_EXECUTE);

            try {
                Files.setPosixFilePermissions(directoryPath, permissions);
                LOGGER.info("Set permissions 777 on directory: " + directoryPath);
            } catch (UnsupportedOperationException e) {
                LOGGER.warning("Could not set POSIX permissions on directory (filesystem may not support POSIX): " + e.getMessage());
            }
        }
    }
}
