package fr.xenonbyte.optifact.backend.infrastructure.user;

import fr.xenonbyte.optifact.backend.application.user.port.out.RoleRepository;
import fr.xenonbyte.optifact.backend.application.user.port.out.UserRepository;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.Role;
import fr.xenonbyte.optifact.backend.domain.user.User;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter(value = Hexagonal.SecondaryAdapter.AdapterType.DATABASE_JPA_POSTGRES)
public final class UserAdapterJpa implements UserRepository, RoleRepository {

    private final UserRepositoryJpa userRepository;
    private final RoleRepositoryJpa roleRepository;
    private final UserMapperJpa mapper;

    public UserAdapterJpa(UserRepositoryJpa userRepository, RoleRepositoryJpa roleRepository, UserMapperJpa mapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.mapper = mapper;
    }

    // UserRepository implementation
    @Override
    public User save(User user) {
        UserJpa saved = userRepository.save(mapper.toJpa(user));
        return mapper.toDomain(saved);
    }

    @Override
    public Optional<User> findById(UUID id) {
        return userRepository.findById(id).map(mapper::toDomain);
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmailIgnoreCase(email).map(mapper::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmailIgnoreCase(email);
    }

    @Override
    public List<User> search(String nameFilter, String emailFilter, String phoneFilter, String roleNameFilter) {
        Specification<UserJpa> spec = (root, query, cb) -> cb.conjunction();

        if (isNotBlank(nameFilter)) {
            String like = like(nameFilter);
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("firstname")), like),
                    cb.like(cb.lower(root.get("lastname")), like)
            ));
        }
        if (isNotBlank(emailFilter)) {
            String like = like(emailFilter);
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("email")), like));
        }
        if (isNotBlank(phoneFilter)) {
            String like = like(phoneFilter);
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("phone")), like));
        }
        if (isNotBlank(roleNameFilter)) {
            String like = like(roleNameFilter);
            spec = spec.and((root, query, cb) -> {
                // Avoid duplicates when joining
                if(query != null) {
                    query.distinct(true);
                }
                return cb.like(cb.lower(root.join("roles").get("name")), like);
            });
        }

        return userRepository.findAll(spec).stream().map(mapper::toDomain).collect(Collectors.toList());
    }

    @Override
    public boolean existByEmailExcludingId(String email, UUID userId) {
        return userRepository.existsByEmailIgnoreCaseAndIdNot(email, userId);
    }

    private static boolean isNotBlank(String v) { return v != null && !v.isBlank(); }
    private static String like(String v) { return "%" + v.toLowerCase() + "%"; }

    // RoleRepository implementation
    @Override
    public Set<Role> findRoles() {
        return roleRepository.findAll().stream().map(mapper::toDomain).collect(Collectors.toSet());
    }

    @Override
    public Optional<Role> findByCode(String code) {
        return roleRepository.findByCode(code).map(mapper::toDomain);
    }
}
