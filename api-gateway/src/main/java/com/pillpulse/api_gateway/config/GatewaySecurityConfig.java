package com.pillpulse.api_gateway.config;

import org.springframework.http.HttpMethod;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationConverter;
import org.springframework.security.oauth2.server.resource.authentication.JwtGrantedAuthoritiesConverter;
import org.springframework.security.oauth2.server.resource.authentication.ReactiveJwtAuthenticationConverterAdapter;
import org.springframework.security.web.server.SecurityWebFilterChain;
import reactor.core.publisher.Mono;


@Configuration
@EnableWebFluxSecurity
public class GatewaySecurityConfig {
    @Bean
    public SecurityWebFilterChain securityFilterChain(ServerHttpSecurity http) {
        http
                .csrf(ServerHttpSecurity.CsrfSpec::disable)
                .authorizeExchange(auth -> auth
                        //PUBLIC ROUTES (No token needed)

                        .pathMatchers(HttpMethod.POST, "/api/pharmacies/register").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/search/**").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/medicines/{id}").permitAll()
                        .pathMatchers(HttpMethod.GET, "/api/medicines").permitAll()

                        //SEMI-PUBLIC ROUTES (Just needs an email, no account)

                        //PROTECTED ROUTES
                        .pathMatchers(HttpMethod.POST, "/api/medicines/**").hasRole("PHARMACY_ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/medicines/**").hasRole("PHARMACY_ADMIN")
                        .pathMatchers(HttpMethod.DELETE, "/api/medicines/**").hasRole("PHARMACY_ADMIN")
                        .pathMatchers(HttpMethod.GET, "/api/pharmacies/**").hasRole("PHARMACY_ADMIN")
                        .pathMatchers(HttpMethod.PUT, "/api/pharmacies/**").hasRole("PHARMACY_ADMIN")

                        .pathMatchers("/api/alerts/**").permitAll()

                        .anyExchange().authenticated()
                )
                .oauth2ResourceServer(oauth2 -> oauth2
                        .jwt(jwt -> jwt.jwtAuthenticationConverter(
                                keycloakJwtConverter()
                        )));
        return http.build();
    }


    // Extract roles from Keycloak JWT token


    public Converter<Jwt, Mono<AbstractAuthenticationToken>>
    keycloakJwtConverter() {


        JwtGrantedAuthoritiesConverter authoritiesConverter =
                new JwtGrantedAuthoritiesConverter();
        authoritiesConverter.setAuthoritiesClaimName("realm_access.roles");
        authoritiesConverter.setAuthorityPrefix("ROLE_");

        JwtAuthenticationConverter jwtConverter =
                new JwtAuthenticationConverter();
        jwtConverter.setJwtGrantedAuthoritiesConverter(authoritiesConverter);

        return new ReactiveJwtAuthenticationConverterAdapter(jwtConverter);
    }
}
