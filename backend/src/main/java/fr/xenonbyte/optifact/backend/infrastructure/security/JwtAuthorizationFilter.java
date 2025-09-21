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

import static java.util.Arrays.asList;
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
            String subject = tokenProvider.extractSubject(getToken(request));
            String token = getToken(request);
            if(tokenProvider.isValidToken(token, request) && tokenProvider.getSubject(subject) != null) {
                List<GrantedAuthority> authorities =  tokenProvider.getAuthorities(token);
                Authentication authentication = tokenProvider.getAuthentication(subject, authorities, request);
                SecurityContextHolder.getContext().setAuthentication(authentication);
            } else {
                SecurityContextHolder.clearContext();
            }
             filterChain.doFilter(request, response);
         } catch (Exception exception) {
             handleExceptionResolver(request, response, exception);
         }
    }

    private void handleExceptionResolver(HttpServletRequest request, HttpServletResponse response, Exception exception) {

    }

    private String getToken(HttpServletRequest request) {
        return ofNullable(request.getHeader("Authorization"))
                .filter(token -> token.startsWith("Bearer "))
                .map(token -> token.replace("Bearer ", ""))
                .get();
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return request.getHeader("Authorization") == null || !request.getHeader("Authorization").startsWith("Bearer ") ||
                request.getMethod().equalsIgnoreCase("OPTIONS") || asList("/swagger-ui/index.html", "/optifact/api/v1/users/auth/**").contains(request.getRequestURI());
    }
}
