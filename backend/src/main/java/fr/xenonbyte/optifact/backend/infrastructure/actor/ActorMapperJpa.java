package fr.xenonbyte.optifact.backend.infrastructure.actor;

import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.infrastructure.actor.address.AddressMapperJpa;
import fr.xenonbyte.optifact.backend.infrastructure.actor.contact.ContactMapperJpa;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;
import org.mapstruct.ReportingPolicy;
import org.mapstruct.factory.Mappers;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Mapper(componentModel = "spring", uses = {AddressMapperJpa.class, ContactMapperJpa.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ActorMapperJpa {
    ActorJpa toJpa(Actor actor);
    Actor toDomain(ActorJpa actorJpa);

    @ObjectFactory
    default Actor createActor(ActorJpa actorJpa) {
        // Build the domain aggregate using factory to keep invariants (normalization + validation)
        var addressMapper = Mappers.getMapper(AddressMapperJpa.class);
        var contactMapper = Mappers.getMapper(ContactMapperJpa.class);
        return Actor.create(
                actorJpa.getId(),
                actorJpa.getName(),
                actorJpa.getReference(),
                actorJpa.getAddresses() == null ? null : actorJpa.getAddresses().stream()
                        .map(addressMapper::toDomain)
                        .toList(),
                actorJpa.getContacts() == null ? null : actorJpa.getContacts().stream()
                        .map(contactMapper::toDomain)
                        .toList(),
                actorJpa.getActive()
        );
    }
}
