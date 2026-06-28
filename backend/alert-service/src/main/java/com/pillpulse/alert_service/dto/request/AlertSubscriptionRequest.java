package com.pillpulse.alert_service.dto.request;

import lombok.Data;

@Data
public class AlertSubscriptionRequest {
    private String userEmail;
    private String userPhone;
    private Long medicineId;
    private Long pharmacyId;
    private String pharmacyName;
}
