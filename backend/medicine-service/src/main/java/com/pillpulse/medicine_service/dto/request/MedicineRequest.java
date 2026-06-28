package com.pillpulse.medicine_service.dto.request;

import lombok.Data;

@Data
public class MedicineRequest {
    private String name;
    private String genericName;
    private String category;
    private String description;
    private String manufacturer;
    private String atcCode;
}
