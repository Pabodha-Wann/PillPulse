package com.pillpulse.alert_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;


import java.time.LocalDateTime;

@Data
@Builder
@RequiredArgsConstructor
@AllArgsConstructor
public class AlertSubscriptionResponse {
    private Long id;
    private String userEmail;
    private String userPhone;
    private Long medicineId;
    private String medicineName;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
