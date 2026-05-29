package com.pillpulse.alert_service.repository;

import com.pillpulse.alert_service.entity.AlertSubscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AlertSubscriptionRepository extends JpaRepository<AlertSubscription,Long> {

    //check is user subscribe to the medicine
    boolean existsByUserEmailAndMedicineId(String UserEmail,Long MedicineId);

    boolean existsByUserEmailAndMedicineIdAndIsActiveTrue(String userEmail, Long medicineId);

    boolean existsByUserPhoneAndMedicineIdAndIsActiveTrue(String userPhone, Long medicineId);

    //Get all subscription for a user
    List<AlertSubscription> findByUserEmail(String useEmail);

    Optional<AlertSubscription> findByUserEmailAndMedicineId(String userEmail, Long medicineId);

    Optional<AlertSubscription> findByUserPhoneAndMedicineId(String userPhone, Long medicineId);

    List<AlertSubscription> findByMedicineIdAndIsActiveTrue(Long medicineId);
}
