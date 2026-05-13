package com.pillpulse.alert_service.repository;

import com.pillpulse.alert_service.entity.AlertSubscription;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertSubscriptionRepository extends JpaRepository<AlertSubscription,Long> {

    //check is user subscribe to the medicine
    boolean existsByUserEmailAndMedicineId(String UserEmail,Long MedicineId);



}
