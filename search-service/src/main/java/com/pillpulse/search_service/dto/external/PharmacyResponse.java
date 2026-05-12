package com.pillpulse.search_service.dto.external;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PharmacyResponse {
    private Long id;
    private String name;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private String email;
}
