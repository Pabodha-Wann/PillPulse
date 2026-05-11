package com.pillpulse.medicine_service.repository;

import com.pillpulse.medicine_service.entity.PharmacyMedicine;
import com.pillpulse.medicine_service.entity.StockStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PharmacyMedicineRepository extends JpaRepository<PharmacyMedicine,Long> {

    //get all medicine in a pharmacy
    List<PharmacyMedicine> findByPharmacyId(Long pharmacyId);

    //check a pharmacy has a medicine
    boolean existsAllByPharmacyIdAndMedicineId(Long pharmacyId, Long medicineId);

    //find a medicine from a specific pharmacy
    Optional<PharmacyMedicine> findByPharmacyIdAndMedicineId(Long pharmacyId, Long medicineId);


    List<PharmacyMedicine> findByMedicineIdAndStatus(Long medicineId, StockStatus stockStatus);
}
