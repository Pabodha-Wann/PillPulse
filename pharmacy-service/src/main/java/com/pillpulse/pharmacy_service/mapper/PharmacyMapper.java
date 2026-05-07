package com.pillpulse.pharmacy_service.mapper;

import com.pillpulse.pharmacy_service.dto.request.PharmacyRegisterRequest;
import com.pillpulse.pharmacy_service.dto.response.PharmacyResponse;
import com.pillpulse.pharmacy_service.entity.Pharmacy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PharmacyMapper {

    //ignore id, createdAt, updatedAt because:
    //  id → database generates it
    //  createdAt/updatedAt → @PrePersist handles it
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "createdAt",ignore = true)
    @Mapping(target = "updatedAt",ignore = true)
    Pharmacy toEntity(PharmacyRegisterRequest pharmacyRegisterRequest);

    PharmacyResponse toResponse(Pharmacy pharmacy);


}
