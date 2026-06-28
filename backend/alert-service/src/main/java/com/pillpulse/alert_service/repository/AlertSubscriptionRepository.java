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

    boolean existsByUserEmailAndMedicineIdAndPharmacyIdAndIsActiveTrue(String userEmail, Long medicineId, Long pharmacyId);

    boolean existsByUserPhoneAndMedicineIdAndPharmacyIdAndIsActiveTrue(String userPhone, Long medicineId, Long pharmacyId);

    //Get all subscription for a user
    List<AlertSubscription> findByUserEmail(String useEmail);

    Optional<AlertSubscription> findByUserEmailAndMedicineIdAndPharmacyId(String userEmail, Long medicineId, Long pharmacyId);

    Optional<AlertSubscription> findByUserPhoneAndMedicineIdAndPharmacyId(String userPhone, Long medicineId, Long pharmacyId);

    List<AlertSubscription> findByMedicineIdAndPharmacyIdAndIsActiveTrue(Long medicineId, Long pharmacyId);
}
