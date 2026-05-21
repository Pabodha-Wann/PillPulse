package com.pillpulse.medicine_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MedicineResponse {
    private Long id;
    private String name;
    private String genericName;
    private String category;
    private String description;
    private String manufacturer;
    private LocalDateTime createdAt;
}
