package com.pillpulse.pharmacy_service.service;

import com.pillpulse.pharmacy_service.dto.request.PharmacyRegisterRequest;
import com.pillpulse.pharmacy_service.dto.response.PharmacyResponse;
import com.pillpulse.pharmacy_service.entity.Pharmacy;
import com.pillpulse.pharmacy_service.mapper.PharmacyMapper;
import com.pillpulse.pharmacy_service.repository.PharmacyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PharmacyService {
    private final PharmacyRepository pharmacyRepository;
    private final PharmacyMapper pharmacyMapper;
    private final PasswordEncoder passwordEncoder;

    public PharmacyResponse register(PharmacyRegisterRequest request){
        if(pharmacyRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already registered:"+ request.getEmail());
        }

        Pharmacy pharmacy = pharmacyMapper.toEntity(request);

        pharmacy.setPassword(passwordEncoder.encode(request.getPassword()));

        Pharmacy saved = pharmacyRepository.save(pharmacy);

        return pharmacyMapper.toResponse(saved);
    }

    public PharmacyResponse getById(Long id){
        Pharmacy pharmacy = pharmacyRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Pharmacy Not Found"));

        return pharmacyMapper.toResponse(pharmacy);
    }

    public List<PharmacyResponse> getAllPharmacies(){
        return pharmacyRepository.findAll()
                .stream()
                .map(pharmacyMapper::toResponse)
                .collect(Collectors.toList());
    }


}
