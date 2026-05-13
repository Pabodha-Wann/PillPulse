package com.pillpulse.alert_service.service;

import com.pillpulse.alert_service.dto.request.AlertSubscriptionRequest;
import com.pillpulse.alert_service.dto.response.AlertSubscriptionResponse;
import com.pillpulse.alert_service.entity.AlertSubscription;
import com.pillpulse.alert_service.repository.AlertSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final AlertSubscriptionRepository alertSubscriptionRepository;



    public AlertSubscriptionResponse subscribe(
            AlertSubscriptionRequest request
    ){
        if(alertSubscriptionRepository.existsByUserEmailAndMedicineId(
                request.getUserEmail(),request.getMedicineId())){
            throw new RuntimeException("Already subscribe to this medicine");
        }




    }

}
