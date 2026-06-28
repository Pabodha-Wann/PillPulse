package com.pillpulse.medicine_service.service;

import com.pillpulse.medicine_service.client.PharmacyServiceClient;
import com.pillpulse.medicine_service.dto.request.MedicineRequest;
import com.pillpulse.medicine_service.dto.request.PharmacyMedicineRequest;
import com.pillpulse.medicine_service.dto.request.PharmacyMedicineUpdateRequest;
import com.pillpulse.medicine_service.dto.response.MedicineResponse;
import com.pillpulse.medicine_service.dto.response.PharmacyMedicineResponse;
import com.pillpulse.medicine_service.dto.response.PharmacyMedicineSearchResponse;
import com.pillpulse.medicine_service.entity.Medicine;
import com.pillpulse.medicine_service.entity.PharmacyMedicine;
import com.pillpulse.medicine_service.entity.StockStatus;
import com.pillpulse.medicine_service.event.StockEvent;
import com.pillpulse.medicine_service.event.StockEventPublisher;
import com.pillpulse.medicine_service.mapper.MedicineMapper;
import com.pillpulse.medicine_service.mapper.PharmacyMedicineMapper;
import com.pillpulse.medicine_service.repository.MedicineRepository;
import com.pillpulse.medicine_service.repository.PharmacyMedicineRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MedicineService {

    private final MedicineRepository medicineRepository;
    private final MedicineMapper medicineMapper;
    private final PharmacyMedicineMapper pharmacyMedicineMapper;
    private final PharmacyMedicineRepository pharmacyMedicineRepository;

    //for webclient
    private final PharmacyServiceClient pharmacyServiceClient;
    private final StockEventPublisher stockEventPublisher;

    public MedicineResponse createMedicine(MedicineRequest medicineRequest){
        String trimmedName = medicineRequest.getName() != null ? medicineRequest.getName().trim() : "";
        String trimmedAtc = medicineRequest.getAtcCode() != null ? medicineRequest.getAtcCode().trim() : "";

        if (medicineRepository.existsByNameIgnoreCaseAndAtcCodeIgnoreCase(trimmedName, trimmedAtc)) {
            throw new RuntimeException("Medicine brand with this ATC code already exists: " + trimmedName + " (" + trimmedAtc + ")");
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

        String trimmedName = medicineRequest.getName() != null ? medicineRequest.getName().trim() : "";
        String trimmedAtc = medicineRequest.getAtcCode() != null ? medicineRequest.getAtcCode().trim() : "";

        boolean nameChanged = !medicine.getName().equalsIgnoreCase(trimmedName);
        boolean atcChanged = medicine.getAtcCode() == null || !medicine.getAtcCode().equalsIgnoreCase(trimmedAtc);

        if ((nameChanged || atcChanged) && medicineRepository.existsByNameIgnoreCaseAndAtcCodeIgnoreCase(trimmedName, trimmedAtc)) {
            throw new RuntimeException("Medicine brand with this ATC code already exists: " + trimmedName + " (" + trimmedAtc + ")");
        }

        Medicine updated = Medicine.builder()
                .id(medicine.getId())
                .name(medicineRequest.getName())
                .genericName(medicineRequest.getGenericName())
                .category(medicineRequest.getCategory())
                .description(medicineRequest.getDescription())
                .manufacturer(medicineRequest.getManufacturer())
                .atcCode(medicineRequest.getAtcCode())
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

    //----Pharmacy Medicine(stock management)----

    public PharmacyMedicineResponse addMedicineToPharmacy(
            PharmacyMedicineRequest pharmacyMedicineRequest
    ){
        //check pharmacy exists using webclient
        pharmacyServiceClient.verifyPharmacyExists(pharmacyMedicineRequest.getPharmacyId());

        if (pharmacyMedicineRequest.getQuantityInStock() != null && pharmacyMedicineRequest.getQuantityInStock() < 0) {
            throw new IllegalArgumentException("Quantity in stock cannot be negative");
        }
        if (pharmacyMedicineRequest.getPrice() != null && pharmacyMedicineRequest.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }

        Medicine medicine = medicineRepository.findById(pharmacyMedicineRequest.getMedicineId())
                .orElseThrow(()-> new RuntimeException(
                        "Medicine not found with id: " + pharmacyMedicineRequest.getMedicineId()
                ));

        if(pharmacyMedicineRepository.existsAllByPharmacyIdAndMedicineId(
                pharmacyMedicineRequest.getPharmacyId(),
                pharmacyMedicineRequest.getMedicineId()
        )){
            throw new RuntimeException(
                "Medicine already exists in this pharmacy"
            );
        }


        //save
        PharmacyMedicine pharmacyMedicine = PharmacyMedicine.builder()
                .pharmacyId(pharmacyMedicineRequest.getPharmacyId())
                .medicine(medicine)
                .quantityInStock(pharmacyMedicineRequest.getQuantityInStock())
                .price(pharmacyMedicineRequest.getPrice())
                .build();

        PharmacyMedicine saved = pharmacyMedicineRepository.save(pharmacyMedicine);
        return pharmacyMedicineMapper.toResponse(saved);
    }

    public List<PharmacyMedicineResponse> getMedicinesByPharmacy(Long pharmacyId){

        pharmacyServiceClient.verifyPharmacyExists(pharmacyId);

        return pharmacyMedicineRepository.findByPharmacyId(pharmacyId)
                .stream()
                .map(pharmacyMedicineMapper::toResponse)
                .collect(Collectors.toList());

    }



    public void removeMedicineFromPharmacy(Long pharmacyId, Long medicineId){
        PharmacyMedicine pharmacyMedicine = pharmacyMedicineRepository.findByPharmacyIdAndMedicineId(pharmacyId,medicineId)
                .orElseThrow(
                        ()-> new RuntimeException("Medicine not found in this pharmacy")
                );

        pharmacyMedicineRepository.delete(pharmacyMedicine);
    }

    public PharmacyMedicineResponse updatePharmacyMedicine(
            Long pharmacyId,
            Long medicineId,
            PharmacyMedicineUpdateRequest request
    ){
        PharmacyMedicine existing = pharmacyMedicineRepository
                .findByPharmacyIdAndMedicineId(pharmacyId,medicineId)
                .orElseThrow(() -> new RuntimeException(
                    "Medicine not found in this pharmacy"
                ));

        if (request.getQuantityInStock() != null && request.getQuantityInStock() < 0) {
            throw new IllegalArgumentException("Quantity in stock cannot be negative");
        }
        if (request.getPrice() != null && request.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }

        int oldQuantity = existing.getQuantityInStock();
        int newQuantity = request.getQuantityInStock();

        PharmacyMedicine updated = PharmacyMedicine.builder()
                .id(existing.getId())
                .pharmacyId(existing.getPharmacyId())
                .medicine(existing.getMedicine())
                .quantityInStock(request.getQuantityInStock())
                .price(request.getPrice())
                .build();

        PharmacyMedicine saved = pharmacyMedicineRepository.save(updated);

        //Publish RabbitMQ event
        StockEvent event = StockEvent.builder()
                .pharmacyId(pharmacyId)
                .medicineId(medicineId)
                .medicineName(existing.getMedicine().getName())
                .quantity(newQuantity)
                .build();

        if(newQuantity == 0){
            stockEventPublisher.publishOutOfStock(event);
        }else if(oldQuantity == 0 && newQuantity > 0){
            stockEventPublisher.publishRestocked(event);
        }

        return pharmacyMedicineMapper.toResponse(saved);
    }

    //Get Pharmacies with a specific medicine
    public List<PharmacyMedicineSearchResponse> searchPharmaciesWithMedicine(
            String medicineName
    ){
        return pharmacyMedicineRepository.findByMedicine_NameIgnoreCaseAndStatus(
                medicineName, StockStatus.IN_STOCK
        )
                .stream()
                .map(pm-> PharmacyMedicineSearchResponse.builder()
                        .pharmacyId(pm.getPharmacyId())
                        .medicineId(pm.getMedicine().getId())
                        .medicineName(pm.getMedicine().getName())
                        .quantityInStock(pm.getQuantityInStock())
                        .price(pm.getPrice())
                        .status(pm.getStatus())
                        .build())
                .collect(Collectors.toList());
    }

}
