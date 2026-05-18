package com.pillpulse.alert_service.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
@Slf4j
public class MedicineClient {

    private final WebClient.Builder webClientBuilder;

    public String getMedicineName(Long medicineId) {
        try {
            MedicineResponse response = webClientBuilder.build()
                    .get()
                    .uri("http://medicine-service/api/medicines/{id}",
                            medicineId)
                    .retrieve()
                    .bodyToMono(MedicineResponse.class)
                    .block();

            return response != null ? response.getName() : null;

        } catch (Exception e) {
            log.error("Medicine not found: {}", medicineId);
            return null;
        }
    }
}