package com.pillpulse.alert_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class StockEvent {
    private Long pharmacyId;
    private Long medicineId;
    private String medicineName;
    private String pharmacyName;
    private Integer quantity;
    private String eventType;

}
