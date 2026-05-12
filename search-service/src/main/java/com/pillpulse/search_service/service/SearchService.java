package com.pillpulse.search_service.service;

import com.pillpulse.search_service.dto.external.PharmacyMedicineSearchResponse;
import com.pillpulse.search_service.dto.external.PharmacyResponse;
import com.pillpulse.search_service.dto.response.SearchResult;
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
                        double distance = calculateDistance(
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


    //---Haversine Formula---
    //Calculates distance between 2 coordinates on Earth
    private double calculateDistance(
            double lat1,double lng1,double lat2,double lng2
    ){
        final int EARTH_RADIUS_KM = 6371;

        double latDistance = Math.toRadians(lat2 - lat1);
        double lngDistance = Math.toRadians(lng2 - lng1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance/2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(lngDistance / 2)
                * Math.sin(lngDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return EARTH_RADIUS_KM * c;
    }

}
