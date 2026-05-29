package com.pillpulse.search_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SearchResult {
    private Long pharmacyId;
    private String pharmacyName;
    private String address;
    private String phone;
    private Double distanceKm;          // how far from user
    private Long medicineId;
    private String medicineName;
    private Integer quantityInStock;
    private BigDecimal price;
    private String status;
    private Double latitude;
    private Double longitude;
}
