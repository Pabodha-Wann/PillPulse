package com.pillpulse.medicine_service.config;

import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {
    public static final String MEDICINE_EXCHANGE = "medicine.exchange";

    public static final String OUT_OF_STOCK_QUEUE = "medicine.out.of.stock";
    public static final String RESTOCK_QUEUE = "medicine.restocked";

    public static final String OUT_OF_STOCK_ROTING_KEY = "medicine.stock.empty";
    public static final String RESTOCK_ROTING_KEY = "medicine.stock.restocked";

    @Bean
    public DirectExchange medicineExchange(){
        return new DirectExchange(MEDICINE_EXCHANGE);
    }

    //Creating queues
    @Bean
    public Queue outOfStockQueue(){
        return new Queue(OUT_OF_STOCK_QUEUE);
    }

    @Bean
    public Queue restockQueue(){
        return new Queue(RESTOCK_QUEUE);
    }

    //bind queue to exchange
    @Bean
    public Binding outOfStockBinding(){
        return BindingBuilder
                .bind(outOfStockQueue())
                .to(medicineExchange())
                .with(OUT_OF_STOCK_ROTING_KEY);
    }

    @Bean
    public Binding restokedbinding(){
        return BindingBuilder
                .bind(restockQueue())
                .to(medicineExchange())
                .with(RESTOCK_ROTING_KEY);
    }

    @Bean
    public Jackson2JsonMessageConverter messageConverter(){
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory){
        RabbitTemplate rabbitTemplate = new RabbitTemplate(connectionFactory);
        rabbitTemplate.setMessageConverter(messageConverter());
        return rabbitTemplate;
    }
}
