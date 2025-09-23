package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.actor.exception.ActorReferenceConflictException;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.user.exception.RoleCodeNotFoundException;
import fr.xenonbyte.optifact.backend.application.user.exception.UserEmailConflictException;
import fr.xenonbyte.optifact.backend.application.user.port.in.RegisterUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.RoleRepository;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.Role;
import fr.xenonbyte.optifact.backend.domain.user.User;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationType;

import java.time.ZonedDateTime;
import java.util.Optional;
import java.util.Set;
import java.util.logging.Logger;

import static fr.xenonbyte.optifact.backend.domain.user.User.DEFAULT_ACTOR_ROLE;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class RegisterUserApplicationService implements RegisterUserUseCase {

    private static final Logger LOGGER = Logger.getLogger(RegisterUserApplicationService.class.getName());

    private final UserRepository repository;
    private final ActorRepository actorRepository;
    private final RoleRepository roleRepository;
    private final CreateVerificationUseCase createVerificationUseCase;

    public RegisterUserApplicationService(
            UserRepository repository,
            ActorRepository actorRepository,
            RoleRepository roleRepository,
            CreateVerificationUseCase createVerificationUseCase) {
        this.repository = repository;
        this.actorRepository = actorRepository;
        this.roleRepository = roleRepository;
        this.createVerificationUseCase = createVerificationUseCase;
    }

    @Override
    public void registerUser(User user, String actorReference) {
        LOGGER.info("Registering user...");

        if (repository.existsByEmail(user.getEmail())) {
            throw new UserEmailConflictException(user.getEmail());
        }

        Optional<Actor> optionalActor = actorRepository.findByRefence(actorReference);
        if(optionalActor.isEmpty()) {
            throw new ActorReferenceConflictException(actorReference);
        }

        Optional<Role> optionalRole = roleRepository.findByCode(DEFAULT_ACTOR_ROLE);

        if(optionalRole.isEmpty()) {
            throw new RoleCodeNotFoundException(DEFAULT_ACTOR_ROLE);
        }

        user  = user.withActorId(optionalActor.get().getId()).withRoles(Set.of(optionalRole.get()));

        repository.save(user);
        LOGGER.info("User registered successfully.");

        Verification verification = Verification.create(user.getId(), null, null, VerificationType.LINK, ZonedDateTime.now().plusDays(User.ACTIVATE_ACCOUNT_CODE_DURATION_DAY));
        verification = createVerificationUseCase.createVerification(verification);
        //TODO create and send account activation link
    }
}
