package com.pillpulse.pharmacy_service.dto.request;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PharmacyRegisterRequest {
    private String name;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;
    private String phone;
    private String email;
    private String password;
}
