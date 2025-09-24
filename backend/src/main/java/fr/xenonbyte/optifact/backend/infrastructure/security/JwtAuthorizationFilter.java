package fr.xenonbyte.optifact.backend.infrastructure.security;

import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

import static java.util.Optional.ofNullable;

/**
 *
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter
public final class JwtAuthorizationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    public JwtAuthorizationFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String token = getToken(request);
            if (token != null) {
                String subject = tokenProvider.extractSubject(token);
                if (tokenProvider.isValidToken(token, request) && tokenProvider.getSubject(subject) != null) {
                    List<GrantedAuthority> authorities = tokenProvider.getAuthorities(token);
                    Authentication authentication = tokenProvider.getAuthentication(subject, authorities, request);
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } else {
                    SecurityContextHolder.clearContext();
                }
            }
            filterChain.doFilter(request, response);
        } catch (Exception exception) {
            // Ensure we never leave the request hanging
            SecurityContextHolder.clearContext();
            // If headers already committed, just stop; otherwise continue the chain to let exception handlers work
            if (!response.isCommitted()) {
                filterChain.doFilter(request, response);
            }
        }
    }

    private void handleExceptionResolver(HttpServletRequest request, HttpServletResponse response, Exception exception) {
        // No-op for now; ensure we don't swallow CORS preflight
    }

    private String getToken(HttpServletRequest request) {
        return ofNullable(request.getHeader("Authorization"))
                .filter(token -> token.startsWith("Bearer "))
                .map(token -> token.replace("Bearer ", ""))
                .orElse(null);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String auth = request.getHeader("Authorization");
        boolean isOptions = "OPTIONS".equalsIgnoreCase(request.getMethod());
        boolean noBearer = auth == null || !auth.startsWith("Bearer ");
        String uri = request.getRequestURI();
        boolean publicPath = uri.startsWith("/swagger-ui/") || uri.startsWith("/v3/api-docs/") || uri.startsWith("/api/v1/optifact/users/auth/");
        return isOptions || noBearer || publicPath;
    }
}
