package com.pillpulse.medicine_service.dto.request;


import lombok.Data;

import java.math.BigDecimal;

@Data
public class PharmacyMedicineUpdateRequest {
    private Integer quantityInStock;
    private BigDecimal price;
}
