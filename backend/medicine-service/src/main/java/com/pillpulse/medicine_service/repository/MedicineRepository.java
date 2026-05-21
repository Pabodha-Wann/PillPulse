package com.pillpulse.medicine_service.repository;

import com.pillpulse.medicine_service.entity.Medicine;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MedicineRepository extends JpaRepository<Medicine,Long> {
    boolean existsByName(String name);

    //find medicine by name
    Optional<Medicine> findByNameIgnoreCase(String name);

}
