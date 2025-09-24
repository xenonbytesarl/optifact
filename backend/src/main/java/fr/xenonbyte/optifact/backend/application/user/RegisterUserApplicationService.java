package fr.xenonbyte.optifact.backend.application.user;

import fr.xenonbyte.optifact.backend.application.actor.exception.ActorReferenceConflictException;
import fr.xenonbyte.optifact.backend.application.actor.port.in.CreateActorUseCase;
import fr.xenonbyte.optifact.backend.application.actor.port.out.ActorRepository;
import fr.xenonbyte.optifact.backend.application.common.setting.port.in.FindFirstSettingUseCase;
import fr.xenonbyte.optifact.backend.application.notification.ports.in.SendEmailUseCase;
import fr.xenonbyte.optifact.backend.application.user.exception.RoleCodeNotFoundException;
import fr.xenonbyte.optifact.backend.application.user.exception.UserEmailConflictException;
import fr.xenonbyte.optifact.backend.application.user.port.in.RegisterUserUseCase;
import fr.xenonbyte.optifact.backend.application.user.port.out.RoleRepository;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.application.verification.port.in.CreateVerificationUseCase;
import fr.xenonbyte.optifact.backend.domain.actor.Actor;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.common.setting.Setting;
import fr.xenonbyte.optifact.backend.domain.common.setting.vo.EmailServer;
import fr.xenonbyte.optifact.backend.domain.user.Role;
import fr.xenonbyte.optifact.backend.domain.user.User;
import fr.xenonbyte.optifact.backend.domain.verification.Verification;
import fr.xenonbyte.optifact.backend.domain.verification.VerificationType;

import java.time.ZonedDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.CompletableFuture;
import java.util.logging.Level;
import java.util.logging.Logger;

import static fr.xenonbyte.optifact.backend.domain.user.User.DEFAULT_ACTOR_ROLE;
import static fr.xenonbyte.optifact.backend.domain.user.User.create;

@Hexagonal(layer = Hexagonal.Layer.APPLICATION, componentType = Hexagonal.ComponentType.APPLICATION_SERVICE)
@Hexagonal.ApplicationService
public final class RegisterUserApplicationService implements RegisterUserUseCase {

    private static final Logger LOGGER = Logger.getLogger(RegisterUserApplicationService.class.getName());

    private final UserRepository repository;
    private final ActorRepository actorRepository;
    private final RoleRepository roleRepository;
    private final CreateVerificationUseCase createVerificationUseCase;
    private final CreateActorUseCase createActorUseCase;
    private final SendEmailUseCase sendEmailUseCase;
    private final FindFirstSettingUseCase findFirstSettingUseCase;

    public RegisterUserApplicationService(
            UserRepository repository,
            ActorRepository actorRepository,
            RoleRepository roleRepository,
            CreateVerificationUseCase createVerificationUseCase,
            CreateActorUseCase createActorUseCase,
            SendEmailUseCase sendEmailUseCase,
            FindFirstSettingUseCase findFirstSettingUseCase) {
        this.repository = repository;
        this.actorRepository = actorRepository;
        this.roleRepository = roleRepository;
        this.createVerificationUseCase = createVerificationUseCase;
        this.createActorUseCase = createActorUseCase;
        this.sendEmailUseCase = sendEmailUseCase;
        this.findFirstSettingUseCase = findFirstSettingUseCase;
    }

    @Override
    public void registerUser(User user, Actor actor) {
        LOGGER.info("Registering user...");

        if (repository.existsByEmail(user.getEmail())) {
            throw new UserEmailConflictException(user.getEmail());
        }


        Actor existing = findActor(actor);
        if(existing == null) {
            existing = createActorUseCase.createActor(actor);
        }

        Optional<Role> optionalRole = roleRepository.findByCode(DEFAULT_ACTOR_ROLE);

        if(optionalRole.isEmpty()) {
            throw new RoleCodeNotFoundException(DEFAULT_ACTOR_ROLE);
        }

        user  = user.withActorId(existing.getId()).withRoles(Set.of(optionalRole.get()));

        user.validateRoles();

        repository.save(user);
        LOGGER.info("User registered successfully.");

        Verification verification = getVerification(user);

        Setting setting = findFirstSettingUseCase.findFirstSetting();
        EmailServer server = setting.getEmailServer();
        sendEmail(user, verification, server);
    }

    private Verification getVerification(User user) {
        Verification verification = Verification.create(user.getId(), null, null, VerificationType.LINK, ZonedDateTime.now().plusDays(User.ACTIVATE_ACCOUNT_CODE_DURATION_DAY));
        verification = createVerificationUseCase.createVerification(verification);
        return verification;
    }

    private void sendEmail(User user, Verification verification, EmailServer server) {
        String recipient = user.getEmail();

        Map<String, Object> model = buildEmailModel(user, verification);

        CompletableFuture.runAsync(() -> {

            try {
                sendEmailUseCase.send(
                        "email/activate-account",
                        model,
                        List.of(recipient),
                        "Activez votre compte",
                        server
                );
                LOGGER.info("Verification email dispatch queued to '" + recipient + "'");
            } catch (Exception e) {
                LOGGER.log(Level.SEVERE, "Failed to send verification email asynchronously", e);
            }
        });
    }

    private static Map<String, Object> buildEmailModel(User user, Verification verification) {
        Map<String, Object> model = new HashMap<>();
        model.put("applicationName", "COSUMAF");
        model.put("name", user.getFullName() );
        model.put("duration", User.ACTIVATE_ACCOUNT_CODE_DURATION_DAY + " jours");
        model.put("activationLink", "/users/activate/" + user.getId() + "/" + verification.getCode());
        return model;
    }

    private Actor findActor(Actor actor) {
        if(actor.getTaxNumber() != null) {
            Optional<Actor> optionalActor = actorRepository.findByTaxNumber(actor.getTaxNumber());
            if (optionalActor.isPresent()) {
                return optionalActor.get();
            }
        }
        if(actor.getRegistrationNumber() != null) {
            Optional<Actor> optionalActor = actorRepository.findByRegistrationNumber(actor.getRegistrationNumber());
            if (optionalActor.isPresent()) {
                return optionalActor.get();
            }
        }
        return null;
    }
}
