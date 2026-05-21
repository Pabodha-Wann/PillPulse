package com.pillpulse.medicine_service.event;

import com.pillpulse.medicine_service.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class StockEventPublisher {
    private final RabbitTemplate rabbitTemplate;

    public void publishOutOfStock(StockEvent event){
        log.info("Publishing out of stock event for medicine:{}",event.getMedicineName());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.MEDICINE_EXCHANGE,
                RabbitMQConfig.OUT_OF_STOCK_ROTING_KEY,
                event
        );
    }

    public void publishRestocked(StockEvent event){
        log.info("Publishing restocked event for medicine:{}",event.getMedicineName());

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.MEDICINE_EXCHANGE,
                RabbitMQConfig.RESTOCK_ROTING_KEY,
                event
        );
    }
}
