package com.pillpulse.pharmacy_service.service;

import com.pillpulse.pharmacy_service.config.JwtService;
import com.pillpulse.pharmacy_service.dto.request.PharmacyLoginRequest;
import com.pillpulse.pharmacy_service.dto.request.PharmacyRegisterRequest;
import com.pillpulse.pharmacy_service.dto.response.PharmacyResponse;
import com.pillpulse.pharmacy_service.entity.Pharmacy;
import com.pillpulse.pharmacy_service.exception.DuplicateResourceException;
import com.pillpulse.pharmacy_service.exception.ResourceNotFoundException;
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
    private final JwtService jwtService;
    private final KeycloakService keycloakService;

    public PharmacyResponse register(PharmacyRegisterRequest request){
        if(pharmacyRepository.existsByEmail(request.getEmail())){
            throw new DuplicateResourceException("Email already registered:"+ request.getEmail());
        }

        //save to DB
        Pharmacy pharmacy = pharmacyMapper.toEntity(request);
        pharmacy.setPassword(passwordEncoder.encode(request.getPassword()));
        Pharmacy saved = pharmacyRepository.save(pharmacy);

        //create user in keycloak
        try{
            keycloakService.createKeycloakUser(request);
        }catch (Exception e){
            pharmacyRepository.delete(saved);
            throw new RuntimeException(
                    "Registration failed: " + e.getMessage()
            );
        }

        return pharmacyMapper.toResponse(saved);
    }

    public PharmacyResponse getById(Long id){
        Pharmacy pharmacy = pharmacyRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Pharmacy Not Found"));

        return pharmacyMapper.toResponse(pharmacy);
    }

    public List<PharmacyResponse> getAllPharmacies(){
        return pharmacyRepository.findAll()
                .stream()
                .map(pharmacyMapper::toResponse)
                .collect(Collectors.toList());
    }

//    public String login(PharmacyLoginRequest request){
//        Pharmacy pharmacy = pharmacyRepository.findByEmail(request.getEmail())
//                .orElseThrow(()-> new RuntimeException("Pharmacy not found"));
//
//        //check password
//        if(!passwordEncoder.matches(request.getPassword(),pharmacy.getPassword())){
//            throw new RuntimeException("Invalid Password");
//        }
//
//        //generate and return Jwt token
//        return jwtService.generateToken(pharmacy.getEmail());
//    }


}
