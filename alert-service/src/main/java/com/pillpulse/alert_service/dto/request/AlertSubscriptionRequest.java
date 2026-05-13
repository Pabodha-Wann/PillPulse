package com.pillpulse.alert_service.dto.request;

import lombok.Data;

@Data
public class AlertSubscriptionRequest {
    private String userEmail;
    private Long medicineId;
    private String medicineName;
}
