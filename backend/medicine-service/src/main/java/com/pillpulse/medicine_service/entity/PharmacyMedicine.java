package com.pillpulse.medicine_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name="pharmacy_medicines")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PharmacyMedicine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="pharmacy_id",nullable = false)
    private Long pharmacyId;

    @ManyToOne
    @JoinColumn(name = "medicine_id",nullable = false)
    private Medicine medicine;

    @Column(name = "quantity_in_stock")
    private Integer quantityInStock;

    private BigDecimal price;

    @JdbcTypeCode(SqlTypes.NAMED_ENUM)
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private StockStatus status;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PreUpdate
    @PrePersist
    protected void onUpdate(){
        updatedAt = LocalDateTime.now();
        updateStatus();
    }

    private void updateStatus(){
        if(quantityInStock == null || quantityInStock == 0){
            status = StockStatus.OUT_OF_STOCK;
        }else if(quantityInStock <= 10){
            status = StockStatus.LOW_STOCK;
        }else{
            status = StockStatus.IN_STOCK;
        }
    }

}
