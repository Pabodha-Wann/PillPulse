package com.pillpulse.medicine_service.service;

import com.pillpulse.medicine_service.dto.request.MedicineRequest;
import com.pillpulse.medicine_service.dto.response.MedicineResponse;
import com.pillpulse.medicine_service.entity.Medicine;
import com.pillpulse.medicine_service.mapper.MedicineMapper;
import com.pillpulse.medicine_service.repository.MedicineRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineMapper  medicineMapper;



    public MedicineResponse createMedicine(MedicineRequest medicineRequest){
        if(medicineRepository.existsByName(medicineRequest.getName())){
            throw new RuntimeException("Medicine already exists: " + medicineRequest.getName());
        }

        Medicine medicine = medicineMapper.toEntity(medicineRequest);
        Medicine saved = medicineRepository.save(medicine);

        return medicineMapper.toResponse(saved);

    }


    public MedicineResponse getMedicineById(Long id){
        Medicine medicine = medicineRepository.findById(id).orElseThrow(
                ()->new RuntimeException("Medicine not found with id: " + id)
        );

        return medicineMapper.toResponse(medicine);
    }

    public List<MedicineResponse> getAllMedicines(){
        return medicineRepository.findAll()
                .stream()
                .map(medicineMapper::toResponse)
                .collect(Collectors.toList());
    }

    public MedicineResponse updateMedicine(Long id,MedicineRequest medicineRequest){
        Medicine medicine = medicineRepository.findById(id).orElseThrow(
                () -> new RuntimeException("Medicine not found with id: " + id)
        );

        Medicine updated = Medicine.builder()
                .id(medicine.getId())
                .name(medicineRequest.getName())
                .genericName(medicineRequest.getGenericName())
                .category(medicineRequest.getCategory())
                .description(medicineRequest.getDescription())
                .manufacturer(medicineRequest.getManufacturer())
                .createdAt(medicine.getCreatedAt())
                .updatedAt(medicine.getUpdatedAt())
                .build();

        Medicine saved = medicineRepository.save(updated);
        return medicineMapper.toResponse(saved);

    }

    public void deleteMedicine(Long id){
        if(!medicineRepository.existsById(id)){
            throw new RuntimeException("Medicine not found with id: " + id);
        }

        medicineRepository.deleteById(id);
    }
}
