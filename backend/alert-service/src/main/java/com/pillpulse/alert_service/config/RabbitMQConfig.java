package com.pillpulse.alert_service.config;
import org.springframework.amqp.core.*;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


@Configuration
public class RabbitMQConfig {
    static final String MEDICINE_EXCHANGE = "medicine.exchange";

    public static final String OUT_OF_STOCK_QUEUE = "medicine.out.of.stock";
    public static final String RESTOCK_QUEUE = "medicine.restocked";

    public static final String OUT_OF_STOCK_ROUTING_KEY = "medicine.stock.empty";
    public static final String RESTOCK_ROUTING_KEY = "medicine.stock.restocked";

    @Bean
    public DirectExchange medicineExchange() {
        return new DirectExchange(MEDICINE_EXCHANGE);
    }

    @Bean
    public Queue outOfStockQueue() {
        return new Queue(OUT_OF_STOCK_QUEUE);
    }

    @Bean
    public Queue restockedQueue() {
        return new Queue(RESTOCK_QUEUE);
    }

    @Bean
    public Binding outOfStockBinding() {
        return BindingBuilder
                .bind(outOfStockQueue())
                .to(medicineExchange())
                .with(OUT_OF_STOCK_ROUTING_KEY);
    }

    @Bean
    public Binding restockedBinding() {
        return BindingBuilder
                .bind(restockedQueue())
                .to(medicineExchange())
                .with(RESTOCK_ROUTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory) {
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }


}
