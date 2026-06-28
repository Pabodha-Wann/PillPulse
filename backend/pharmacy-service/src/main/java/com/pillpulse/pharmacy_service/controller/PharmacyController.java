package com.pillpulse.pharmacy_service.controller;

import com.pillpulse.pharmacy_service.dto.request.PharmacyLoginRequest;
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

    @PutMapping("/{id}")
    public ResponseEntity<PharmacyResponse> updatePharmacy(
            @PathVariable Long id,
            @RequestBody PharmacyRegisterRequest request
    ){
        return ResponseEntity.ok(pharmacyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePharmacy(@PathVariable Long id){
        pharmacyService.delete(id);
        return ResponseEntity.noContent().build();
    }

//    @PostMapping("/login")
//    public ResponseEntity<String> login(
//            @RequestBody PharmacyLoginRequest request
//    ){
//        String token = pharmacyService.login(request);
//        return ResponseEntity.ok(token);
//    }

    @PutMapping("/{id}/verify")
    public ResponseEntity<PharmacyResponse> verifyPharmacy(@PathVariable Long id) {
        return ResponseEntity.ok(pharmacyService.verifyPharmacy(id));
    }
}
