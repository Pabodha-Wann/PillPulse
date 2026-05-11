package com.pillpulse.medicine_service.controller;

import com.pillpulse.medicine_service.dto.request.MedicineRequest;
import com.pillpulse.medicine_service.dto.response.MedicineResponse;
import com.pillpulse.medicine_service.service.MedicineService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineService medicineService;

    @PostMapping
    public ResponseEntity<MedicineResponse> createMedicine(
            @RequestBody MedicineRequest request
    ){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(medicineService.createMedicine(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicineResponse> getMedicineById(
            @PathVariable Long id
    ){
        return ResponseEntity.ok(medicineService.getMedicineById(id));
    }

    @GetMapping
    public ResponseEntity<List<MedicineResponse>> getAllMedicines(){
        return ResponseEntity.ok(medicineService.getAllMedicines());
    }

    @PutMapping("/{id}")
    public ResponseEntity<MedicineResponse> updateMedicine(
            @PathVariable Long id,
            @RequestBody MedicineRequest request
    ){
        return ResponseEntity.ok(medicineService.updateMedicine(id,request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedicine(@PathVariable Long id){
        medicineService.deleteMedicine(id);
        return ResponseEntity.noContent().build();
    }
}
