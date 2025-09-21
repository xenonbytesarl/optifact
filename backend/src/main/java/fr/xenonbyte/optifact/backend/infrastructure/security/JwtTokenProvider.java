package fr.xenonbyte.optifact.backend.infrastructure.security;

import fr.xenonbyte.optifact.backend.application.user.port.out.TokenProvider;
import fr.xenonbyte.optifact.backend.domain.common.annotation.Hexagonal;
import fr.xenonbyte.optifact.backend.domain.user.User;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.HttpServletRequest;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.Instant;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.security.core.userdetails.UserDetails;

import javax.crypto.SecretKey;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author bamk
 * @version 1.0
 * @since 21/09/2025
 */
@Hexagonal(layer = Hexagonal.Layer.ADAPTER, componentType = Hexagonal.ComponentType.SECONDARY_ADAPTER)
@Hexagonal.SecondaryAdapter
public final class JwtTokenProvider implements TokenProvider {
    
    private final CustomUserDetailsService userDetailsService;
    
    @Value("${optifact.jwt.issuer}")
    private String issuer;

    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Value("${optifact.jwt.secret}")
    private String secret;
    
    @Value("${optifact.jwt.access.expiration}")
    private long accessExpiration;
    
    @Value("${optifact.jwt.refresh.expiration}")
    private long refreshExpiration;

    public JwtTokenProvider(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Override
    public String generateAccessToken(User user) {

        CustomUserDetails userDetails = new CustomUserDetails(user);

        Instant now = Instant.now();
        Instant exp = now.plusMillis(accessExpiration);
        List<String> authorities = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toList());
        return Jwts.builder()
                .issuer(issuer)
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claim("authorities", authorities)
                .signWith(getSigningKey(), Jwts.SIG.HS256)
                .compact();
    }

    @Override
    public String generateRefreshToken(User user) {

        CustomUserDetails userDetails = new CustomUserDetails(user);

        Instant now = Instant.now();
        Instant exp = now.plusMillis(refreshExpiration);
        return Jwts.builder()
                .issuer(issuer)
                .subject(userDetails.getUsername())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .claim("type", "refresh")
                .signWith(getSigningKey())
                .compact();
    }

    public String extractSubject(String token) {
       return extractClaim(token, Claims::getSubject);
    }


    public boolean isValidToken(String token, HttpServletRequest request) {
        Date expiration = extractExpiration(token);
        return getSubject(token) != null && expiration != null && !expiration.before(new Date());
    }


    public UserDetails getSubject(String subject) {
        if (subject == null || subject.isBlank()) return null;
        return userDetailsService.loadUserByUsername(subject);
    }

    public List<GrantedAuthority> getAuthorities(String token) {
        if (token == null || token.isBlank()) return List.of();
        Map<String, Object> claims = extractAllClaims(token);
        Object claim = claims.get("authorities");
        if (claim instanceof Collection<?> list) {
            return list.stream()
                    .map(Object::toString)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        }
        return List.of();
    }

    public Authentication getAuthentication(String subject, List<GrantedAuthority> authorities, HttpServletRequest request) {

        UserDetails userDetails = userDetailsService.loadUserByUsername(subject);

        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(userDetails, null, authorities);
        authenticationToken.setDetails(request);
        return authenticationToken;
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parser()
                .verifyWith(getSigningKey())
                .build().parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {
        byte[] signingKeyBytes = Decoders.BASE64.decode(secret);
        return Keys.hmacShaKeyFor(signingKeyBytes);
    }
    
    
}
