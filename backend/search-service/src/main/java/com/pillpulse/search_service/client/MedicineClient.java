package com.pillpulse.search_service.client;

import com.pillpulse.search_service.dto.external.PharmacyMedicineSearchResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class MedicineClient {

    private final WebClient.Builder webClientBuilder;

    public List<PharmacyMedicineSearchResponse> searchPharmaciesWithMedicine(
            String medicineName) {
        try {
            return webClientBuilder.build()
                    .get()
                    .uri("http://medicine-service/api/medicines/search?name="
                            + medicineName)
                    .retrieve()
                    .bodyToFlux(PharmacyMedicineSearchResponse.class)
                    .collectList()
                    .block();
        } catch (Exception e) {
            log.error("Failed to search medicine {}: {}",
                    medicineName, e.getMessage());
            return List.of();
        }
    }
}