package fr.xenonbyte.optifact.backend.infrastructure.actor.address;

import fr.xenonbyte.optifact.backend.domain.actor.address.Address;
import fr.xenonbyte.optifact.backend.domain.actor.address.AddressType;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

/**
 * @author bamk
 * @version 1.0
 * @since 07/09/2025
 */
@Mapper
public interface AddressMapperJpa {
    AddressJpa toJpa(Address address);
    Address toDomain(AddressJpa addressJpa);

    @ObjectFactory
    default Address createAddress(AddressJpa addressJpa) {
        return Address.create(
                addressJpa.getId(),
                AddressType.valueOf(addressJpa.getType().name()),
                addressJpa.getStreet(),
                addressJpa.getCity(),
                addressJpa.getCountry(),
                addressJpa.getZipCode(),
                addressJpa.getState(),
                addressJpa.getActor().getId(),
                addressJpa.getActive()
        );
    }
}
