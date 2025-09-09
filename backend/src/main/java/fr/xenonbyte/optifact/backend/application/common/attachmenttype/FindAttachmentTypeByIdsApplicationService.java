package fr.xenonbyte.optifact.backend.application.common.attachmenttype;

import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.in.FindAttachmentTypeByIdsUseCase;
import fr.xenonbyte.optifact.backend.application.common.attachmenttype.port.out.AttachmentTypeRepository;
import fr.xenonbyte.optifact.backend.application.productcategory.FindProductCategoryByIdsApplicationService;
import fr.xenonbyte.optifact.backend.application.productcategory.port.out.ProductCategoryRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.attachementtype.AttachmentType;
import fr.xenonbyte.optifact.backend.domain.product.productcategory.ProductCategory;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.logging.Logger;

/**
 * @author bamk
 * @version 1.0
 * @since 09/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class FindAttachmentTypeByIdsApplicationService implements FindAttachmentTypeByIdsUseCase {

    private static final Logger LOGGER = Logger.getLogger(FindAttachmentTypeByIdsApplicationService.class.getName());

    private final AttachmentTypeRepository repository;

    public FindAttachmentTypeByIdsApplicationService(AttachmentTypeRepository repository) {
        this.repository = repository;
    }

    @Override
    public List<AttachmentType> findAttachmentTypeByIds(Set<UUID> attachmentTypeIds) {
        LOGGER.info("Find attachment types for ids: '" + attachmentTypeIds + "'" );

        List<AttachmentType> productCategories = repository.findByIds(attachmentTypeIds);

        LOGGER.info("Attachment types found successfully for ids: '" + attachmentTypeIds + "'" );
        return productCategories;
    }
}
