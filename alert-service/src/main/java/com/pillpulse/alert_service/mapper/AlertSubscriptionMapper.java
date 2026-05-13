package com.pillpulse.alert_service.mapper;

import com.pillpulse.alert_service.dto.request.AlertSubscriptionRequest;
import com.pillpulse.alert_service.dto.response.AlertSubscriptionResponse;
import com.pillpulse.alert_service.entity.AlertSubscription;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AlertSubscriptionMapper {

    @Mapping(target= "id",ignore = true)
    @Mapping(target = "createdAt",ignore = true)
    @Mapping(target = "isActive",ignore = true)
    AlertSubscription toEntity(AlertSubscriptionRequest alertSubscriptionRequest);

    AlertSubscriptionResponse toResponse(AlertSubscription alertSubscription);
}
