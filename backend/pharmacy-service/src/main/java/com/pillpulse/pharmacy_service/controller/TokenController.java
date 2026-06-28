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
import com.pillpulse.pharmacy_service.repository.PharmacyRepository;
import com.pillpulse.pharmacy_service.mapper.PharmacyMapper;
import com.pillpulse.pharmacy_service.dto.response.PharmacyResponse;

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

    private final PharmacyRepository pharmacyRepository;
    private final PharmacyMapper pharmacyMapper;
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

            // Check verification status in DB first
            var pharmacyOpt = pharmacyRepository.findByEmail(request.getEmail());
            if (pharmacyOpt.isPresent() && !pharmacyOpt.get().getIsVerified()) {
                throw new RuntimeException("Your pharmacy account is pending admin verification. Please contact support at admin@pillpulse.com to activate your account.");
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
            Map<?, ?> tokenResponse = restTemplate.postForObject(
                    tokenUrl,
                    body,
                    Map.class
            );

            // Fetch real database profile
            var pharmacy = pharmacyRepository.findByEmail(request.getEmail())
                    .orElseThrow(() -> new ResourceNotFoundException("Pharmacy profile not found: " + request.getEmail()));
            
            PharmacyResponse pharmacyProfile = pharmacyMapper.toResponse(pharmacy);

            // Construct enriched response
            Map<String, Object> enrichedResponse = new HashMap<>();
            enrichedResponse.put("access_token", tokenResponse.get("access_token"));
            enrichedResponse.put("refresh_token", tokenResponse.get("refresh_token"));
            enrichedResponse.put("expires_in", tokenResponse.get("expires_in"));
            enrichedResponse.put("user", pharmacyProfile);

            log.info("✅ Login successful for: {}", request.getEmail());
            return ResponseEntity.ok(enrichedResponse);

        } catch (RestClientException e) {
            log.error("❌ Keycloak error: {}", e.getMessage());
            throw new RuntimeException("Invalid email or password");

        } catch (Exception e) {
            log.error("❌ Login error: {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> request) {
        try {
            String refreshToken = request.get("refresh_token");
            if (refreshToken == null || refreshToken.isEmpty()) {
                throw new RuntimeException("Refresh token is required");
            }

            String tokenUrl = keycloakUrl + "/realms/" + realm + "/protocol/openid-connect/token";

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "refresh_token");
            body.add("client_id", clientId);
            body.add("client_secret", clientSecret);
            body.add("refresh_token", refreshToken);

            log.info("🔑 Attempting token refresh");

            Map<?, ?> tokenResponse = restTemplate.postForObject(
                    tokenUrl,
                    body,
                    Map.class
            );

            Map<String, Object> enrichedResponse = new HashMap<>();
            enrichedResponse.put("access_token", tokenResponse.get("access_token"));
            enrichedResponse.put("refresh_token", tokenResponse.get("refresh_token"));
            enrichedResponse.put("expires_in", tokenResponse.get("expires_in"));

            return ResponseEntity.ok(enrichedResponse);

        } catch (Exception e) {
            log.error("❌ Token refresh error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Invalid or expired refresh token"));
        }
    }
}