package com.pillpulse.medicine_service.mapper;

import com.pillpulse.medicine_service.dto.request.MedicineRequest;
import com.pillpulse.medicine_service.dto.response.MedicineResponse;
import com.pillpulse.medicine_service.entity.Medicine;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface MedicineMapper {

    @Mapping(target = "id",ignore = true)
    @Mapping(target = "createdAt",ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Medicine toEntity(MedicineRequest medicineRequest);


    MedicineResponse toResponse(Medicine medicine);
}
