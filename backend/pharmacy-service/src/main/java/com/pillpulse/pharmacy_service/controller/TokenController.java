package com.pillpulse.pharmacy_service.controller;

import com.pillpulse.pharmacy_service.dto.request.PharmacyLoginRequest;
import com.pillpulse.pharmacy_service.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Slf4j
@RequiredArgsConstructor
public class TokenController {

    @Value("${keycloak.auth-server-url}")
    private String keycloakUrl;

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.client-id}")
    private String clientId;

    @Value("${keycloak.client-secret}")
    private String clientSecret;

    private final RestTemplate restTemplate = new RestTemplate();

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody PharmacyLoginRequest request) {

        try {
            // Validate input
            if (request.getEmail() == null || request.getEmail().isEmpty()) {
                throw new RuntimeException("Email is required");
            }
            if (request.getPassword() == null || request.getPassword().isEmpty()) {
                throw new RuntimeException("Password is required");
            }

            String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";

            // Build request body
            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "password");
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("username", request.getEmail());
            body.add("password", request.getPassword());

            log.info("🔑 Attempting login for: {}", request.getEmail());

            // Call Keycloak
            Map<String, Object> response = restTemplate.postForObject(
                    tokenUrl,
                    body,
                    Map.class
            );

            log.info("✅ Login successful for: {}", request.getEmail());
            return ResponseEntity.ok(response);

        } catch (RestClientException e) {
            log.error("❌ Keycloak error: {}", e.getMessage());
            throw new RuntimeException("Invalid email or password");

        } catch (Exception e) {
            log.error("❌ Login error: {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }
}