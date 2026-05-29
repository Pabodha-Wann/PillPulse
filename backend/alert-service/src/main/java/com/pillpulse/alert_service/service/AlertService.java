package com.pillpulse.alert_service.service;

import com.pillpulse.alert_service.client.MedicineClient;
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
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertService {

    private final AlertSubscriptionRepository alertSubscriptionRepository;
    private final AlertSubscriptionMapper alertSubscriptionMapper;

    private final AlertHistoryRepository alertHistoryRepository;
    private final AlertHistoryMapper alertHistoryMapper;
    private final MedicineClient medicineClient;
    private final TwilioSmsService twilioSmsService;
    private final EmailNotificationService emailNotificationService;


    public AlertSubscriptionResponse subscribe(
            AlertSubscriptionRequest request
    ){
        String medicineName = medicineClient.getMedicineName(request.getMedicineId());

        if (medicineName == null) {
            throw new ResourceNotFoundException(
                    "Medicine not found with id: " + request.getMedicineId()
            );
        }

        // 1. Check if email already has an active subscription for this medicine
        boolean emailExists = alertSubscriptionRepository
                .existsByUserEmailAndMedicineIdAndIsActiveTrue(request.getUserEmail(), request.getMedicineId());
        if (emailExists) {
            throw new DuplicateResourceException("Already subscribed to this medicine with this email address.");
        }

        // 2. Check if phone already has an active subscription for this medicine
        if (request.getUserPhone() != null && !request.getUserPhone().trim().isEmpty()) {
            boolean phoneExists = alertSubscriptionRepository
                    .existsByUserPhoneAndMedicineIdAndIsActiveTrue(request.getUserPhone().trim(), request.getMedicineId());
            if (phoneExists) {
                throw new DuplicateResourceException("Already subscribed to this medicine with this phone number.");
            }
        }

        Optional<AlertSubscription> existing = alertSubscriptionRepository
                .findByUserEmailAndMedicineId(request.getUserEmail(), request.getMedicineId());

        if (existing.isEmpty() && request.getUserPhone() != null && !request.getUserPhone().trim().isEmpty()) {
            existing = alertSubscriptionRepository
                    .findByUserPhoneAndMedicineId(request.getUserPhone().trim(), request.getMedicineId());
        }

        if (existing.isPresent()) {
            // Because we checked active ones above, this existing one is currently inactive -> reactivate it
            AlertSubscription reactivated = existing.get();
            reactivated.setIsActive(true);
            reactivated.setUserEmail(request.getUserEmail());
            reactivated.setUserPhone(request.getUserPhone());
            AlertSubscription saved = alertSubscriptionRepository.save(reactivated);

            // Send subscription confirmation email
            emailNotificationService.sendSubscriptionConfirmationEmail(saved.getUserEmail(), saved.getMedicineName());

            // Log subscription confirmation to alert history logs
            alertHistoryRepository.save(AlertHistory.builder()
                    .userEmail(saved.getUserEmail())
                    .medicineId(saved.getMedicineId())
                    .medicineName(saved.getMedicineName())
                    .pharmacyId(0L)
                    .message("Re-subscribed to stock alerts via Email/SMS.")
                    .build());

            return alertSubscriptionMapper.toResponse(saved);
        }

        AlertSubscription alertSubscription = alertSubscriptionMapper.toEntity(request);
        alertSubscription.setMedicineName(medicineName);
        AlertSubscription saved = alertSubscriptionRepository.save(alertSubscription);

        // Send subscription confirmation email
        emailNotificationService.sendSubscriptionConfirmationEmail(saved.getUserEmail(), saved.getMedicineName());

        // Log subscription confirmation to alert history logs
        alertHistoryRepository.save(AlertHistory.builder()
                .userEmail(saved.getUserEmail())
                .medicineId(saved.getMedicineId())
                .medicineName(saved.getMedicineName())
                .pharmacyId(0L)
                .message("Subscribed to stock alerts via Email/SMS.")
                .build());

        return alertSubscriptionMapper.toResponse(saved);

    }


    public List<AlertSubscriptionResponse> getAllSubscriptions() {
        return alertSubscriptionRepository.findAll().stream()
                .map(alertSubscriptionMapper::toResponse)
                .collect(Collectors.toList());
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

        // Send unsubscription confirmation email
        emailNotificationService.sendUnsubscriptionConfirmationEmail(subscription.getUserEmail(), subscription.getMedicineName());

        // Log unsubscription to alert history logs
        alertHistoryRepository.save(AlertHistory.builder()
                .userEmail(subscription.getUserEmail())
                .medicineId(subscription.getMedicineId())
                .medicineName(subscription.getMedicineName())
                .pharmacyId(0L)
                .message("Unsubscribed from stock alerts.")
                .build());
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

            // Send real SMS if a user phone number is associated with the subscription
            if (sub.getUserPhone() != null && !sub.getUserPhone().trim().isEmpty()) {
                String pharmacyName = event.getPharmacyName() != null ? event.getPharmacyName() : "Pharmacy #" + event.getPharmacyId();
                twilioSmsService.sendAlert(
                        sub.getUserPhone().trim(),
                        event.getMedicineName(),
                        pharmacyName,
                        event.getQuantity()
                );
            }

            // Send real-time restock alert email
            String pharmacyName = event.getPharmacyName() != null ? event.getPharmacyName() : "Pharmacy #" + event.getPharmacyId();
            emailNotificationService.sendRestockAlertEmail(
                    sub.getUserEmail(),
                    event.getMedicineName(),
                    pharmacyName,
                    event.getQuantity()
            );
        });

    }
}
