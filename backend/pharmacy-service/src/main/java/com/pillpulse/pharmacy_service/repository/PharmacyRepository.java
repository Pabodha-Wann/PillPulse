package com.pillpulse.pharmacy_service.repository;

import com.pillpulse.pharmacy_service.entity.Pharmacy;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PharmacyRepository extends JpaRepository<Pharmacy,Long> {
    Optional<Pharmacy> findByEmail(String email);
    boolean existsByEmail(String email);
}
