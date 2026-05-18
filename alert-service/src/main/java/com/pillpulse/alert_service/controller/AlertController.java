package com.pillpulse.alert_service.controller;

import com.pillpulse.alert_service.dto.request.AlertSubscriptionRequest;
import com.pillpulse.alert_service.dto.response.AlertHistoryResponse;
import com.pillpulse.alert_service.dto.response.AlertSubscriptionResponse;
import com.pillpulse.alert_service.entity.AlertHistory;
import com.pillpulse.alert_service.service.AlertService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
@RequiredArgsConstructor
public class AlertController {

    private final AlertService alertService;

    @PostMapping("/subscribe")
    public ResponseEntity<AlertSubscriptionResponse> subscribe(
            @RequestBody AlertSubscriptionRequest request
            ){
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(alertService.subscribe(request));
    }

    @GetMapping("/subscriptions/{email}")
    public ResponseEntity<List<AlertSubscriptionResponse>> getUserSubscriptions(
            @PathVariable String email
    ){
        return ResponseEntity.ok(alertService.getUserSubscriptions(email));
    }

    @DeleteMapping("/unsubscribe/{email}/medicine/{medicineId}")
    public ResponseEntity<Void> unsubscribe(
            @PathVariable String email,
            @PathVariable Long medicineId
    ){
        alertService.unsubscribe(email,medicineId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history/{email}")
    public ResponseEntity<List<AlertHistoryResponse>> getUserAlertHistory(
        @PathVariable String email
    ){
        return ResponseEntity.ok(alertService.getUserAlertHistory(email));
    }


}
