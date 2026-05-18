package com.pillpulse.alert_service.service;

import com.pillpulse.alert_service.dto.request.AlertSubscriptionRequest;
import com.pillpulse.alert_service.dto.response.AlertHistoryResponse;
import com.pillpulse.alert_service.dto.response.AlertSubscriptionResponse;
import com.pillpulse.alert_service.entity.AlertHistory;
import com.pillpulse.alert_service.entity.AlertSubscription;
import com.pillpulse.alert_service.event.StockEvent;
import com.pillpulse.alert_service.exception.DuplicateResourceException;
import com.pillpulse.alert_service.exception.ResourceNotFoundException;
import com.pillpulse.alert_service.mapper.AlertHistoryMapper;
import com.pillpulse.alert_service.mapper.AlertSubscriptionMapper;
import com.pillpulse.alert_service.repository.AlertHistoryRepository;
import com.pillpulse.alert_service.repository.AlertSubscriptionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final AlertSubscriptionRepository alertSubscriptionRepository;
    private final AlertSubscriptionMapper alertSubscriptionMapper;

    private final AlertHistoryRepository alertHistoryRepository;
    private final AlertHistoryMapper alertHistoryMapper;


    public AlertSubscriptionResponse subscribe(
            AlertSubscriptionRequest request
    ){
        if(alertSubscriptionRepository.existsByUserEmailAndMedicineId(
                request.getUserEmail(),request.getMedicineId())){
            throw new DuplicateResourceException("Already subscribe to this medicine");
        }

        AlertSubscription alertSubscription = alertSubscriptionMapper.toEntity(request);

        AlertSubscription saved = alertSubscriptionRepository.save(alertSubscription);

        return alertSubscriptionMapper.toResponse(saved);

    }


    public List<AlertSubscriptionResponse> getUserSubscriptions(
            String userEmail
    ){
        List<AlertSubscription> subscriptions = alertSubscriptionRepository.findByUserEmail(userEmail);

        if (subscriptions.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No subscriptions found for email: " + userEmail
            );
        }

        return subscriptions.stream()
                .map(alertSubscriptionMapper::toResponse)
                .collect(Collectors.toList());
    }

    public void unsubscribe(String userEmail,Long medicineId){

        AlertSubscription subscription = alertSubscriptionRepository
                .findByUserEmailAndMedicineId(userEmail,medicineId)
                .orElseThrow(()->new ResourceNotFoundException(
                        "Subscription not found for this medicine"
                ));

        subscription.setIsActive(false);
        alertSubscriptionRepository.save(subscription);
    }

    public List<AlertHistoryResponse> getUserAlertHistory(
            String userEmail
    ){

        List<AlertHistory> history = alertHistoryRepository.findByUserEmailOrderBySentAtDesc(userEmail);

        if (history.isEmpty()) {
            throw new ResourceNotFoundException(
                    "No alert history found for email: " + userEmail
            );
        }

        return history.stream()
                .map(alertHistoryMapper::toResponse)
                .collect(Collectors.toList());
    }


    //---------RabbitMQ event handlers--------------
    public void handleOutOfStock(StockEvent event){
        log.info("Medicine {} is now OUT OF STOCK at pharmacy {}",
                event.getMedicineName(), event.getPharmacyId());
    }

    public void handleRestocked(StockEvent event){

        //find all users subscribe to medicine
        List<AlertSubscription> subscription = alertSubscriptionRepository
                .findByMedicineIdAndIsActiveTrue(event.getMedicineId());

        log.info("Medicine {} restocked - notifying {} subscribers"
                ,event.getMedicineName(),subscription.size());

        subscription.forEach(sub-> {
            String message = String.format(
                    "%s is now available at Pharmacy ID %d. Quantity: %d",
                    event.getMedicineName(),
                    event.getPharmacyId(),
                    event.getQuantity()
            );
            AlertHistory history = alertHistoryMapper.toEntity(sub,event,message);

            alertHistoryRepository.save(history);
            log.info("Notified {} : {}", sub.getUserEmail(), message);
        });

    }
}
