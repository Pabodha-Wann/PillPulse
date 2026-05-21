package com.pillpulse.medicine_service.mapper;

import com.pillpulse.medicine_service.dto.request.PharmacyMedicineRequest;
import com.pillpulse.medicine_service.dto.response.PharmacyMedicineResponse;
import com.pillpulse.medicine_service.entity.PharmacyMedicine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PharmacyMedicineMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "medicine", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    PharmacyMedicine toEntity(PharmacyMedicineRequest pharmacyMedicineRequest);

    @Mapping(target = "medicineId",source = "medicine.id")
    @Mapping(target = "medicineName",source = "medicine.name")
    PharmacyMedicineResponse toResponse(PharmacyMedicine pharmacyMedicine);
}
