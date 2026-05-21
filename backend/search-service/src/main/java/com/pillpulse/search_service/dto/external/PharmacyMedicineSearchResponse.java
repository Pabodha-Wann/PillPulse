package com.pillpulse.search_service.dto.external;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PharmacyMedicineSearchResponse {
    private Long pharmacyId;
    private Long medicineId;
    private String medicineName;
    private Integer quantityInStock;
    private BigDecimal price;
    private String status;
}
