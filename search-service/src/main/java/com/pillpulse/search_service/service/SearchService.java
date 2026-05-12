package com.pillpulse.search_service.service;

import com.pillpulse.search_service.dto.external.PharmacyMedicineSearchResponse;
import com.pillpulse.search_service.dto.external.PharmacyResponse;
import com.pillpulse.search_service.dto.response.SearchResult;
import com.pillpulse.search_service.util.HaversineUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final WebClient.Builder webClientBuilder;

    public List<SearchResult> searchPharmacies(
            String medicineName,
            double userLat,
            double userLng,
            double radiusKm
    ){

        //Call medicine-service - GET medicines with pharmacies
        log.info("Searching for medicine: {}",medicineName);

        List<PharmacyMedicineSearchResponse> pharmacyMedicines =
                webClientBuilder.build()
                        .get()
                        .uri("http://medicine-service/api/medicines/search?name=" + medicineName)
                        .retrieve()
                        .bodyToFlux(PharmacyMedicineSearchResponse.class)
                        .collectList()
                        .block();

        if(pharmacyMedicines == null || pharmacyMedicines.isEmpty()){
            log.info("Pharmacy Medicine not found");
            return List.of();
        }


        //Call pharmacy-service - GET location
        return pharmacyMedicines.stream()
                .map(pm->{
                    try{
                        PharmacyResponse pharmacy = webClientBuilder.build()
                                .get()
                                .uri("http://pharmacy-service/api/pharmacies/{id}",pm.getPharmacyId())
                                .retrieve()
                                .bodyToMono(PharmacyResponse.class)
                                .block();

                        if(pharmacy == null) return null;

                        //calculate distance using haversine formula
                        double distance = HaversineUtil.calculateDistance(
                                userLat,userLng,
                                pharmacy.getLatitude().doubleValue(),
                                pharmacy.getLongitude().doubleValue()
                        );

                        //Filter out pharmacies
                        if(distance > radiusKm) return null;

                        return SearchResult.builder()
                                .pharmacyId(pharmacy.getId())
                                .pharmacyName(pharmacy.getName())
                                .address(pharmacy.getAddress())
                                .phone(pharmacy.getPhone())
                                .distanceKm(distance)
                                .medicineName(pm.getMedicineName())
                                .quantityInStock(pm.getQuantityInStock())
                                .price(pm.getPrice())
                                .status(pm.getStatus())
                                .build();



                    }catch (Exception ex){
                        log.info("Error fetching pharmacy {} : {}",pm.getPharmacyId(),ex.getMessage());
                        return null;
                    }
                })
                .filter(Objects::nonNull)  /// remove nulls
                .sorted(Comparator.comparingDouble(SearchResult::getDistanceKm))
                .collect(Collectors.toList());  //sort nearest first

    }

}
