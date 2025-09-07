package fr.xenonbyte.optifact.backend.api.actor;

import fr.xenonbyte.optifact.backend.api.actor.generated.view.AddressRequestView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.AddressResponseView;
import fr.xenonbyte.optifact.backend.api.actor.generated.view.AddressTypeView;
import fr.xenonbyte.optifact.backend.domain.actor.address.Address;
import fr.xenonbyte.optifact.backend.domain.actor.address.AddressType;
import org.mapstruct.Mapper;
import org.mapstruct.ObjectFactory;

import java.util.UUID;

/**
 * Dedicated mapper for Address API <-> Domain mappings.
 * Keeps ActorMapperView focused on Actor-level mapping.
 */
@Mapper
public interface AddressMapperView {

    // API -> Domain
    Address toDomain(AddressRequestView view);

    // Domain -> API
    default AddressResponseView toResponse(Address address) {
        return mapToResponse(address);
    }

    @ObjectFactory
    default Address createAddress(AddressRequestView view) {
        AddressType type = view.getType() == null ? null : AddressType.valueOf(view.getType().getValue());
        return Address.create(
                type,
                view.getStreet(),
                view.getCity(),
                view.getCountry(),
                view.getZipCode(),
                view.getState(),
                view.getActive()
        );
    }

    // MapStruct can't infer enum conversion and optional actorId enrichment directly, so use default method for response
    default AddressResponseView mapToResponse(Address address) {
        AddressResponseView resp = new AddressResponseView()
                .type(address.getType() == null ? null : AddressTypeView.fromValue(address.getType().name()))
                .street(address.getStreet())
                .city(address.getCity())
                .country(address.getCountry())
                .zipCode(address.getZipCode())
                .state(address.getState())
                .active(address.getActive())
                .id(address.getId());
        UUID actorId = address.getActorId();
        if (actorId != null) {
            resp.actorId(actorId);
        }
        return resp;
    }

    // Delegate to default method to keep a clean public naming
    default AddressResponseView toResponseInternal(Address address) { return mapToResponse(address); }

}