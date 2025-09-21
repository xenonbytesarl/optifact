package fr.xenonbyte.optifact.backend.application.common.attachmenttype;

import fr.xenonbyte.optifact.backend.application.common.attachmenttype.exception.AttachmentTypeIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.FindAttachmentTypeByIdUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out.AttachmentTypeRepository;
import fr.xenonbyte.optifact.backend.application.productcategory.FindProductCategoryByIdApplicationService;
import fr.xenonbyte.optifact.backend.application.productcategory.exception.ProductCategoryIdNotFoundException;
import fr.xenonbyte.optifact.backend.application.productcategory.port.out.ProductCategoryRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;

import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public class FindAttachmentTypeByIdApplicationService implements FindAttachmentTypeByIdUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindAttachmentTypeByIdApplicationService.class.getName());

    private final AttachmentTypeRepository repository;

    public FindAttachmentTypeByIdApplicationService(AttachmentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public AttachmentType findAttachmentTypeById(UUID attachmentTypeId) {
        LOGGER.info("Find attachment type with id: '" + attachmentTypeId + "'" );

        AttachmentType attachmentType = repository.findById(attachmentTypeId)
                .orElseThrow(() -> new AttachmentTypeIdNotFoundException(attachmentTypeId));

        LOGGER.info("Attachment type found successfully with id: '" + attachmentTypeId + "'" );
        return attachmentType;
    }
}
