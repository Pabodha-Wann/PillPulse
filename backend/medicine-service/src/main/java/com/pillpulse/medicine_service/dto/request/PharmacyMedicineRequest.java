package com.pillpulse.medicine_service.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PharmacyMedicineRequest {
    private Long pharmacyId;
    private Long medicineId;
    private Integer quantityInStock;
    private BigDecimal price;
}
