package com.pillpulse.alert_service.mapper;

import com.pillpulse.alert_service.dto.response.AlertHistoryResponse;
import com.pillpulse.alert_service.entity.AlertHistory;
import com.pillpulse.alert_service.entity.AlertSubscription;
import com.pillpulse.alert_service.event.StockEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AlertHistoryMapper {

    @Mapping(target = "medicineId",ignore = true)
    AlertHistory toEntity(AlertHistoryResponse alertHistoryResponse);


    @Mapping(target = "id",ignore = true)
    @Mapping(target = "sentAt",ignore = true)
    @Mapping(target = "medicineId", source = "event.medicineId")
    @Mapping(target = "medicineName", source = "event.medicineName")
    AlertHistory toEntity(AlertSubscription sub, StockEvent event,String message);


    AlertHistoryResponse toResponse(AlertHistory alertHistory);

}
