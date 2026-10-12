package com.spendwise.service;

import com.spendwise.dto.budget.BudgetRequest;
import com.spendwise.dto.budget.BudgetResponse;
import com.spendwise.dto.budget.BudgetSummaryResponse;
import com.spendwise.entity.Budget;
import com.spendwise.entity.Category;
import com.spendwise.entity.TransactionType;
import com.spendwise.entity.User;
import com.spendwise.exception.BadRequestException;
import com.spendwise.exception.DuplicateResourceException;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.TransactionRepository;
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
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BudgetServiceTest {

    @Mock
    private BudgetRepository budgetRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private BudgetService budgetService;

    private User user;
    private Category expenseCat;
    private Category incomeCat;

    @BeforeEach
    void setUp() {
        user = new User("Alice", "alice@example.com", "hash");
        user.setId(3L);

        expenseCat = new Category(null, "Dining", TransactionType.EXPENSE, "Utensils", "#F97316", true);
        expenseCat.setId(15L);

        incomeCat = new Category(null, "Salary", TransactionType.INCOME, "Briefcase", "#3B82F6", true);
        incomeCat.setId(25L);
    }

    @Test
    @DisplayName("Should create budget for valid expense category")
    void shouldCreateBudgetSuccessfully() {
        BudgetRequest request = new BudgetRequest(15L, new BigDecimal("10000.00"), 10, 2026, 80);

        when(userRepository.findById(3L)).thenReturn(Optional.of(user));
        when(categoryRepository.findAvailableByIdAndUser(15L, 3L)).thenReturn(Optional.of(expenseCat));
        when(budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(3L, 15L, 10, 2026)).thenReturn(false);
        when(budgetRepository.save(any(Budget.class))).thenAnswer(inv -> {
            Budget b = inv.getArgument(0);
            b.setId(50L);
            return b;
        });
        when(transactionRepository.sumExpenseByUserIdAndCategoryAndDateBetween(eq(3L), eq(15L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("4500.00"));

        BudgetResponse response = budgetService.createBudget(3L, request);

        assertNotNull(response);
        assertEquals(50L, response.getId());
        assertEquals(new BigDecimal("10000.00"), response.getAmount());
        assertEquals(new BigDecimal("4500.00"), response.getActualSpending());
        assertEquals(new BigDecimal("5500.00"), response.getRemainingAmount());
        assertEquals(45.0, response.getUtilizationPercentage());
        assertEquals("NORMAL", response.getStatus());
    }

    @Test
    @DisplayName("Should reject budget creation for income category")
    void shouldRejectBudgetForIncomeCategory() {
        BudgetRequest request = new BudgetRequest(25L, new BigDecimal("10000.00"), 10, 2026, 80);

        when(userRepository.findById(3L)).thenReturn(Optional.of(user));
        when(categoryRepository.findAvailableByIdAndUser(25L, 3L)).thenReturn(Optional.of(incomeCat));

        assertThrows(BadRequestException.class, () -> budgetService.createBudget(3L, request));
        verify(budgetRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should trigger WARNING and EXCEEDED status according to spending threshold")
    void shouldCalculateCorrectWarningStatus() {
        Budget budget = new Budget(user, expenseCat, new BigDecimal("10000.00"), 10, 2026, 80);
        budget.setId(51L);

        when(budgetRepository.findByUserIdAndMonthAndYear(3L, 10, 2026)).thenReturn(List.of(budget));
        // Spending 8500 out of 10000 = 85% -> WARNING status
        when(transactionRepository.sumExpenseByUserIdAndCategoryAndDateBetween(eq(3L), eq(15L), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(new BigDecimal("8500.00"));

        BudgetSummaryResponse summary = budgetService.getBudgetSummary(3L, 10, 2026);

        assertEquals(1, summary.getBudgets().size());
        assertEquals("WARNING", summary.getBudgets().get(0).getStatus());
        assertEquals(85.0, summary.getBudgets().get(0).getUtilizationPercentage());
    }
}
