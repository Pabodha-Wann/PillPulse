package com.pillpulse.pharmacy_service.controller;

import com.pillpulse.pharmacy_service.dto.request.PharmacyRegisterRequest;
import com.pillpulse.pharmacy_service.dto.response.PharmacyResponse;
import com.pillpulse.pharmacy_service.service.PharmacyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/pharmacies")
public class PharmacyController {
    private final PharmacyService pharmacyService;

    @PostMapping("/register")
    public ResponseEntity<PharmacyResponse> register(
            @RequestBody PharmacyRegisterRequest request
    ){
        PharmacyResponse response = pharmacyService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PharmacyResponse> getPharmacy(@PathVariable Long id){
        return ResponseEntity.ok(pharmacyService.getById(id));
    }

    @GetMapping
    public ResponseEntity<List<PharmacyResponse>> getAllPharmacies(){
        return ResponseEntity.ok(pharmacyService.getAllPharmacies());
    }

}
