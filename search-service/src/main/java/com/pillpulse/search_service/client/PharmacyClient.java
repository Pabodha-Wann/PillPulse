package com.pillpulse.search_service.client;

import com.pillpulse.search_service.dto.external.PharmacyResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
@Slf4j
public class PharmacyClient {

    private final WebClient.Builder webClientBuilder;

    public PharmacyResponse getPharmacyById(Long pharmacyId) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri("http://pharmacy-service/api/pharmacies/{id}",
                            pharmacyId)
                    .retrieve()
                    .bodyToMono(PharmacyResponse.class)
                    .block();
        } catch (Exception e) {
            log.error("Failed to fetch pharmacy {}: {}",
                    pharmacyId, e.getMessage());
            return null;
        }
    }
}