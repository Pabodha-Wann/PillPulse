package com.pillpulse.medicine_service.repository;

import com.pillpulse.medicine_service.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine,Long> {
    boolean existsByName(String name);
}
