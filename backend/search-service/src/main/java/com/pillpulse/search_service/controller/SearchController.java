package com.pillpulse.search_service.controller;

import com.pillpulse.search_service.dto.response.SearchResult;
import com.pillpulse.search_service.service.SearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/search")
@RequiredArgsConstructor
public class SearchController {
    private final SearchService searchService;

    // GET /api/search?medicineName=Panadol&latitude=6.9271&longitude=79.8612&radius=10
    @GetMapping
    public ResponseEntity<List<SearchResult>> searchPharmacies(
            @RequestParam String medicineName,
            @RequestParam double latitude,
            @RequestParam double longitude,
            @RequestParam(defaultValue = "10") double radius
    ){
        return ResponseEntity.ok(
                searchService.searchPharmacies(
                        medicineName,latitude,longitude,radius
                )
        );
    }

}
