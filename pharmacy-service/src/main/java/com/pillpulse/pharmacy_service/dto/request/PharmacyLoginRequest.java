package com.pillpulse.pharmacy_service.dto.request;

import lombok.Data;

@Data
public class PharmacyLoginRequest {
    private String email;
    private String password;
}
