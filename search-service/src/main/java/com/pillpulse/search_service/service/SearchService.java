package com.pillpulse.search_service.service;

import com.pillpulse.search_service.dto.response.SearchResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SearchService {

    public List<SearchResult> searchPharmacies(
            String medicineName,
            double userLat,
            double userLng,
            double radiusKm
    ){
        return null;
    }

}
