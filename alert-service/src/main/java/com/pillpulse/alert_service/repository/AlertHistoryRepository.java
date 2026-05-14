package com.pillpulse.alert_service.repository;

import com.pillpulse.alert_service.entity.AlertHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertHistoryRepository extends JpaRepository<AlertHistory,Long> {

}
