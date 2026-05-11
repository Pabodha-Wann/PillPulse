package com.pillpulse.medicine_service.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

@Component
@RequiredArgsConstructor
@Slf4j
public class PharmacyServiceClient {
    private final WebClient.Builder webClientBuilder;

    public void verifyPharmacyExists(Long pharmacyId) {

        log.info("Verifying pharmacy exists via PharmacyServiceClient: {}", pharmacyId);
        try{
            webClientBuilder.build()
                    .get()
                    .uri("http://pharmacy-service/api/pharmacies/{id}",pharmacyId)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();
        }catch (Exception e){
            throw new RuntimeException(
                    "Pharmacy ot found with id: " + pharmacyId
            );
        }
    }
}
