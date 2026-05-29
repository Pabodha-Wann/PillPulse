package com.pillpulse.search_service.service;

import com.pillpulse.search_service.client.MedicineClient;
import com.pillpulse.search_service.client.PharmacyClient;
import com.pillpulse.search_service.dto.external.PharmacyMedicineSearchResponse;
import com.pillpulse.search_service.dto.external.PharmacyResponse;
import com.pillpulse.search_service.dto.response.SearchResult;
import com.pillpulse.search_service.exception.ResourceNotFoundException;
import com.pillpulse.search_service.util.HaversineUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SearchService {

    private final PharmacyClient pharmacyClient;    // ← injected
    private final MedicineClient medicineClient;

    public List<SearchResult> searchPharmacies(
            String medicineName,
            double userLat,
            double userLng,
            double radiusKm
    ){

        //Call medicine-service - GET medicines with pharmacies
        log.info("Searching for medicine: {}",medicineName);

        List<PharmacyMedicineSearchResponse> pharmacyMedicines = medicineClient.searchPharmaciesWithMedicine(medicineName);

        if(pharmacyMedicines == null || pharmacyMedicines.isEmpty()){
            throw new ResourceNotFoundException(
                    "No pharmacies found with medicine: " + medicineName
            );
        }


        //Call pharmacy-service - GET location
        return pharmacyMedicines.stream()
                .map(pm->{
                    try{
                        PharmacyResponse pharmacy = pharmacyClient.getPharmacyById(pm.getPharmacyId());

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
                                .medicineId(pm.getMedicineId())
                                .medicineName(pm.getMedicineName())
                                .quantityInStock(pm.getQuantityInStock())
                                .price(pm.getPrice())
                                .status(pm.getStatus())
                                .latitude(pharmacy.getLatitude().doubleValue())
                                .longitude(pharmacy.getLongitude().doubleValue())
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
