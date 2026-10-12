package com.spendwise.service;

import com.spendwise.dto.savings.SavingsGoalEntryRequest;
import com.spendwise.dto.savings.SavingsGoalRequest;
import com.spendwise.dto.savings.SavingsGoalResponse;
import com.spendwise.entity.SavingsEntryType;
import com.spendwise.entity.SavingsGoal;
import com.spendwise.entity.SavingsGoalStatus;
import com.spendwise.entity.User;
import com.spendwise.exception.BadRequestException;
import com.spendwise.repository.SavingsGoalEntryRepository;
import com.spendwise.repository.SavingsGoalRepository;
import com.spendwise.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SavingsGoalServiceTest {

    @Mock
    private SavingsGoalRepository savingsGoalRepository;

    @Mock
    private SavingsGoalEntryRepository savingsGoalEntryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private SavingsGoalService savingsGoalService;

    private User user;
    private SavingsGoal goal;

    @BeforeEach
    void setUp() {
        user = new User("Bob", "bob@example.com", "hash");
        user.setId(4L);

        goal = new SavingsGoal(user, "Laptop Fund", "New machine",
                new BigDecimal("100000.00"), new BigDecimal("40000.00"),
                LocalDate.of(2027, 1, 1), SavingsGoalStatus.IN_PROGRESS);
        goal.setId(60L);
    }

    @Test
    @DisplayName("Should add contribution and recalculate progress")
    void shouldAddContributionSuccessfully() {
        when(savingsGoalRepository.findByIdAndUserId(60L, 4L)).thenReturn(Optional.of(goal));
        when(savingsGoalRepository.save(any(SavingsGoal.class))).thenAnswer(inv -> inv.getArgument(0));

        SavingsGoalEntryRequest entryRequest = new SavingsGoalEntryRequest(
                SavingsEntryType.CONTRIBUTION,
                new BigDecimal("20000.00"),
                "Bonus payment",
                LocalDate.now()
        );

        SavingsGoalResponse response = savingsGoalService.addEntry(4L, 60L, entryRequest);

        assertNotNull(response);
        assertEquals(new BigDecimal("60000.00"), response.getCurrentAmount());
        assertEquals(new BigDecimal("40000.00"), response.getRemainingAmount());
        assertEquals(60.0, response.getProgressPercentage());
        assertEquals(SavingsGoalStatus.IN_PROGRESS, response.getStatus());
        verify(savingsGoalEntryRepository, times(1)).save(any());
    }

    @Test
    @DisplayName("Should mark goal as COMPLETED when contributions reach or exceed target")
    void shouldMarkGoalAsCompletedWhenTargetReached() {
        when(savingsGoalRepository.findByIdAndUserId(60L, 4L)).thenReturn(Optional.of(goal));
        when(savingsGoalRepository.save(any(SavingsGoal.class))).thenAnswer(inv -> inv.getArgument(0));

        // Add 65,000 to 40,000 -> 105,000 (Target is 100,000)
        SavingsGoalEntryRequest entryRequest = new SavingsGoalEntryRequest(
                SavingsEntryType.CONTRIBUTION,
                new BigDecimal("65000.00"),
                "Major deposit",
                LocalDate.now()
        );

        SavingsGoalResponse response = savingsGoalService.addEntry(4L, 60L, entryRequest);

        assertEquals(new BigDecimal("105000.00"), response.getCurrentAmount());
        assertEquals(BigDecimal.ZERO, response.getRemainingAmount());
        assertEquals(105.0, response.getProgressPercentage());
        assertEquals(SavingsGoalStatus.COMPLETED, response.getStatus());
    }

    @Test
    @DisplayName("Should reject withdrawal when requested amount exceeds current saved balance")
    void shouldRejectExcessiveWithdrawal() {
        when(savingsGoalRepository.findByIdAndUserId(60L, 4L)).thenReturn(Optional.of(goal));

        // Current saved is 40,000; attempting to withdraw 50,000
        SavingsGoalEntryRequest entryRequest = new SavingsGoalEntryRequest(
                SavingsEntryType.WITHDRAWAL,
                new BigDecimal("50000.00"),
                "Emergency withdrawal",
                LocalDate.now()
        );

        assertThrows(BadRequestException.class, () -> savingsGoalService.addEntry(4L, 60L, entryRequest));
        verify(savingsGoalEntryRepository, never()).save(any());
    }
}
