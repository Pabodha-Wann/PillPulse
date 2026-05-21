package com.pillpulse.alert_service.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AlertHistoryResponse {
    private Long id;
    private String userEmail;
    private String medicineName;
    private Long pharmacyId;
    private String message;
    private LocalDateTime sentAt;

}
