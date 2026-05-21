package com.pillpulse.alert_service.event;

import com.pillpulse.alert_service.config.RabbitMQConfig;
import com.pillpulse.alert_service.service.AlertService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StockEventListener {

    private final AlertService alertService;

    @RabbitListener(queues = RabbitMQConfig.OUT_OF_STOCK_QUEUE)
    public void handleOutOfStock(StockEvent event){
        log.info("Received OUT_OF_STOCK event for medicine: {}",event.getMedicineName());
        alertService.handleOutOfStock(event);
    }

    @RabbitListener(queues = RabbitMQConfig.RESTOCK_QUEUE)
    public void handleRestoked(StockEvent event){
        log.info("Received RESTOCKED event for medicine: {}",event.getMedicineName());
        alertService.handleRestocked(event);
    }

}
