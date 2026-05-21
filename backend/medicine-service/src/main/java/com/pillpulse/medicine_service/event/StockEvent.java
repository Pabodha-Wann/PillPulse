package com.pillpulse.medicine_service.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StockEvent {
    private Long pharmacyId;
    private Long medicineId;
    private String medicineName;
    private String pharmacyName;
    private Integer quantity;
    private String eventType;     //OUT_OF_STOCK or RESTOKED
}
