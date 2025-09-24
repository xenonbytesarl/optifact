package fr.xenonbyte.optifact.backend.domain.common.vo;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;

/**
 * Simple value object representing an email attachment.
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.VALUE_OBJECT)
@Hexagonal.ValueObject
public final class EmailAttachment {
    private final String filename;
    private final String contentType; // e.g. application/pdf, image/png
    private final byte[] content;

    public EmailAttachment(String filename, String contentType, byte[] content) {
        if (filename == null || filename.isBlank()) throw new IllegalArgumentException("filename must not be blank");
        if (content == null || content.length == 0) throw new IllegalArgumentException("content must not be empty");
        this.filename = filename;
        this.contentType = (contentType == null || contentType.isBlank()) ? "application/octet-stream" : contentType;
        this.content = content;
    }

    public String getFilename() { return filename; }
    public String getContentType() { return contentType; }
    public byte[] getContent() { return content; }
}
