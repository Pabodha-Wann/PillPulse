package com.pillpulse.api_gateway.config;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.config.Customizer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;
import java.util.Arrays;
import reactor.core.publisher.Mono;

@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfig {
    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) {
        http
                .cors(Customizer.withDefaults())
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(auth -> auth
                        // PUBLIC ROUTES (No token needed)

                        .pathMatchers(HttpMethod.OPTIONS, "/**").permitAll() // Ensure OPTIONS is allowed everywhere
                        .pathMatchers(HttpMethod.POST, "/api/pharmacies/register").permitAll()
                        .pathMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/search/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/medicines/{id}").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/medicines").permitAll()

                        // SEMI-PUBLIC ROUTES (Just needs an email, no account)

                        // PROTECTED ROUTES
                        .pathMatchers(HttpMethod.POST, "/api/medicines/**").hasRole("PHARMACY_ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/medicines/**").hasRole("PHARMACY_ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/medicines/**").hasRole("PHARMACY_ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/pharmacies/**").hasRole("PHARMACY_ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/pharmacies/**").hasRole("PHARMACY_ADMIN")

                        .pathMatchers("/api/alerts/**").permitAll()

                        .anyExchange().authenticated())
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(
                                keycloakJwtConverter())));
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH", "HEAD"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // Extract roles from Keycloak JWT token

    public Converter<Jwt, Mono<AbstractAuthenticationToken>> keycloakJwtConverter() {
        return jwt -> {
            java.util.Collection<org.springframework.security.core.GrantedAuthority> authorities = new java.util.ArrayList<>();

            // Extract roles from realm_access
            if (jwt.hasClaim("realm_access")) {
                java.util.Map<String, Object> realmAccess = jwt.getClaimAsMap("realm_access");
                if (realmAccess != null && realmAccess.containsKey("roles")) {
                    java.util.Collection<String> roles = (java.util.Collection<String>) realmAccess.get("roles");
                    for (String role : roles) {
                        authorities.add(
                                new org.springframework.security.core.authority.SimpleGrantedAuthority("ROLE_" + role));
                    }
                }
            }

            return Mono.just(
                    new org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken(jwt,
                            authorities));
        };
    }
}
