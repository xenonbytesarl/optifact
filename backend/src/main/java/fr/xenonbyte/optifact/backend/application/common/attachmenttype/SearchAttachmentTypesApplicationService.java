package fr.xenonbyte.optifact.backend.application.common.attachmenttype;

import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.SearchAttachmentTypesUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out.AttachmentTypeRepository;
import fr.xenonbyte.optifact.backend.application.common.payload.CommonSearch;
import fr.xenonbyte.optifact.backend.application.common.payload.Pagination;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;

import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class SearchAttachmentTypesApplicationService implements SearchAttachmentTypesUseCase {

    private static final Logger LOGGER = Logger.getLogger(SearchAttachmentTypesApplicationService.class.getName());

    private final AttachmentTypeRepository repository;

    public SearchAttachmentTypesApplicationService(AttachmentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public Pagination<AttachmentType> searchAttachmentTypes(String nameFilter, CommonSearch search) {
        LOGGER.info("Searching attachment types with nameFilter: '" + nameFilter + "'" );

        Pagination<AttachmentType> attachmentTypePage = repository.search(nameFilter, search);

        LOGGER.info("Found " + attachmentTypePage.elements().size() + " attachment types (total: " + attachmentTypePage.totalElements() + ")");
        return attachmentTypePage;

    }
}
