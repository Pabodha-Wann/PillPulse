package com.pillpulse.alert_service.mapper;

import com.pillpulse.alert_service.dto.response.AlertHistoryResponse;
import com.pillpulse.alert_service.entity.AlertHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AlertHistoryMapper {

    @Mapping(target = "medicineId",ignore = true)
    AlertHistory toEntity(AlertHistoryResponse alertHistoryResponse);


    AlertHistoryResponse toResponse(AlertHistory alertHistory);
}
