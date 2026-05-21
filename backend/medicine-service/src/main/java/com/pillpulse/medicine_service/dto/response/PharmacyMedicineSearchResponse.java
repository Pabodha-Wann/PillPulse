package com.pillpulse.medicine_service.dto.response;

import com.pillpulse.medicine_service.entity.StockStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyMedicineSearchResponse {
    private Long pharmacyId;
    private Long medicineId;
    private String medicineName;
    private Integer quantityInStock;
    private BigDecimal price;
    private StockStatus status;


}
