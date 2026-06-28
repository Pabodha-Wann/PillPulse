package com.pillpulse.medicine_service.service;

import com.pillpulse.medicine_service.client.PharmacyServiceClient;
import com.pillpulse.medicine_service.dto.request.MedicineRequest;
import com.pillpulse.medicine_service.dto.request.PharmacyMedicineRequest;
import com.pillpulse.medicine_service.dto.request.PharmacyMedicineUpdateRequest;
import com.pillpulse.medicine_service.dto.response.MedicineResponse;
import com.pillpulse.medicine_service.dto.response.PharmacyMedicineResponse;
import com.pillpulse.medicine_service.entity.Medicine;
import com.pillpulse.medicine_service.entity.PharmacyMedicine;
import com.pillpulse.medicine_service.event.StockEvent;
import com.pillpulse.medicine_service.event.StockEventPublisher;
import com.pillpulse.medicine_service.mapper.MedicineMapper;
import com.pillpulse.medicine_service.mapper.PharmacyMedicineMapper;
import com.pillpulse.medicine_service.repository.MedicineRepository;
import com.pillpulse.medicine_service.repository.PharmacyMedicineRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class MedicineServiceTest {

    @Mock
    private MedicineRepository medicineRepository;

    @Mock
    private PharmacyMedicineRepository pharmacyMedicineRepository;

    @Mock
    private PharmacyServiceClient pharmacyServiceClient;

    @Mock
    private PharmacyMedicineMapper pharmacyMedicineMapper;

    @Mock
    private MedicineMapper medicineMapper;

    @Mock
    private StockEventPublisher stockEventPublisher;

    @InjectMocks
    private MedicineService medicineService;

    private PharmacyMedicineRequest validRequest;
    private Medicine mockMedicine;

    @BeforeEach
    void setUp() {
        // Arrange standard test data before each test
        validRequest = new PharmacyMedicineRequest();
        validRequest.setPharmacyId(1L);
        validRequest.setMedicineId(10L);
        validRequest.setQuantityInStock(150);
        validRequest.setPrice(BigDecimal.valueOf(25.50));

        mockMedicine = Medicine.builder()
                .id(10L)
                .name("Panadol")
                .genericName("Paracetamol")
                .atcCode("N02BE01")
                .build();
    }

    // ==========================================
    // TESTS FOR: addMedicineToPharmacy
    // ==========================================

    @Test
    void addMedicineToPharmacy_Success() {
        // Arrange
        doNothing().when(pharmacyServiceClient).verifyPharmacyExists(1L);
        when(medicineRepository.findById(10L)).thenReturn(Optional.of(mockMedicine));
        when(pharmacyMedicineRepository.existsAllByPharmacyIdAndMedicineId(1L, 10L)).thenReturn(false);
        
        PharmacyMedicine savedEntity = PharmacyMedicine.builder()
                .id(100L)
                .pharmacyId(1L)
                .medicine(mockMedicine)
                .quantityInStock(150)
                .price(BigDecimal.valueOf(25.50))
                .build();
                
        when(pharmacyMedicineRepository.save(any(PharmacyMedicine.class))).thenReturn(savedEntity);
        
        PharmacyMedicineResponse expectedResponse = new PharmacyMedicineResponse();
        expectedResponse.setId(100L);
        expectedResponse.setQuantityInStock(150);
        
        when(pharmacyMedicineMapper.toResponse(savedEntity)).thenReturn(expectedResponse);

        // Act
        PharmacyMedicineResponse actualResponse = medicineService.addMedicineToPharmacy(validRequest);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(100L, actualResponse.getId());
        assertEquals(150, actualResponse.getQuantityInStock());
        
        verify(pharmacyMedicineRepository, times(1)).save(any(PharmacyMedicine.class));
    }

    @Test
    void addMedicineToPharmacy_ThrowsException_WhenQuantityIsNegative() {
        // Arrange: set a negative stock quantity
        validRequest.setQuantityInStock(-5);
        doNothing().when(pharmacyServiceClient).verifyPharmacyExists(1L);

        // Act & Assert
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            medicineService.addMedicineToPharmacy(validRequest);
        });

        assertEquals("Quantity in stock cannot be negative", exception.getMessage());
        verify(pharmacyMedicineRepository, never()).save(any(PharmacyMedicine.class));
    }

    // ==========================================
    // TESTS FOR: createMedicine (ATC Validation)
    // ==========================================

    @Test
    void createMedicine_Success() {
        // Arrange
        MedicineRequest createRequest = new MedicineRequest();
        createRequest.setName("Panadol");
        createRequest.setGenericName("Paracetamol");
        createRequest.setCategory("Analgesics");
        createRequest.setAtcCode("N02BE01");

        when(medicineRepository.existsByNameIgnoreCaseAndAtcCodeIgnoreCase("Panadol", "N02BE01")).thenReturn(false);
        when(medicineMapper.toEntity(createRequest)).thenReturn(mockMedicine);
        when(medicineRepository.save(mockMedicine)).thenReturn(mockMedicine);

        MedicineResponse expectedResponse = new MedicineResponse();
        expectedResponse.setId(10L);
        expectedResponse.setName("Panadol");
        expectedResponse.setAtcCode("N02BE01");

        when(medicineMapper.toResponse(mockMedicine)).thenReturn(expectedResponse);

        // Act
        MedicineResponse actualResponse = medicineService.createMedicine(createRequest);

        // Assert
        assertNotNull(actualResponse);
        assertEquals("Panadol", actualResponse.getName());
        assertEquals("N02BE01", actualResponse.getAtcCode());
        verify(medicineRepository, times(1)).save(mockMedicine);
    }

    @Test
    void createMedicine_ThrowsException_WhenDuplicateBrandAndAtcExists() {
        // Arrange
        MedicineRequest createRequest = new MedicineRequest();
        createRequest.setName("Panadol");
        createRequest.setGenericName("Paracetamol");
        createRequest.setAtcCode("N02BE01");

        when(medicineRepository.existsByNameIgnoreCaseAndAtcCodeIgnoreCase("Panadol", "N02BE01")).thenReturn(true);

        // Act & Assert
        RuntimeException exception = assertThrows(RuntimeException.class, () -> {
            medicineService.createMedicine(createRequest);
        });

        assertTrue(exception.getMessage().contains("Medicine brand with this ATC code already exists"));
        verify(medicineRepository, never()).save(any(Medicine.class));
    }

    // ==========================================
    // TESTS FOR: updatePharmacyMedicine
    // ==========================================

    @Test
    void updatePharmacyMedicine_Success_PublishesRestockEvent() {
        // Arrange
        PharmacyMedicineUpdateRequest updateRequest = new PharmacyMedicineUpdateRequest();
        updateRequest.setQuantityInStock(50); // restock from 0 to 50
        updateRequest.setPrice(BigDecimal.valueOf(30.00));

        PharmacyMedicine existingEntity = PharmacyMedicine.builder()
                .id(100L)
                .pharmacyId(1L)
                .medicine(mockMedicine)
                .quantityInStock(0) // starts at 0 (out of stock)
                .price(BigDecimal.valueOf(25.50))
                .build();

        when(pharmacyMedicineRepository.findByPharmacyIdAndMedicineId(1L, 10L)).thenReturn(Optional.of(existingEntity));

        PharmacyMedicine updatedEntity = PharmacyMedicine.builder()
                .id(100L)
                .pharmacyId(1L)
                .medicine(mockMedicine)
                .quantityInStock(50)
                .price(BigDecimal.valueOf(30.00))
                .build();

        when(pharmacyMedicineRepository.save(any(PharmacyMedicine.class))).thenReturn(updatedEntity);

        PharmacyMedicineResponse expectedResponse = new PharmacyMedicineResponse();
        expectedResponse.setId(100L);
        expectedResponse.setQuantityInStock(50);

        when(pharmacyMedicineMapper.toResponse(updatedEntity)).thenReturn(expectedResponse);

        // Act
        PharmacyMedicineResponse actualResponse = medicineService.updatePharmacyMedicine(1L, 10L, updateRequest);

        // Assert
        assertNotNull(actualResponse);
        assertEquals(50, actualResponse.getQuantityInStock());
        
        // Verify that the restock event is published since old quantity was 0 and new quantity is > 0
        verify(stockEventPublisher, times(1)).publishRestocked(any(StockEvent.class));
        verify(stockEventPublisher, never()).publishOutOfStock(any(StockEvent.class));
    }
}
