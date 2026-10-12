package com.spendwise.service;

import com.spendwise.dto.transaction.TransactionRequest;
import com.spendwise.dto.transaction.TransactionResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.Transaction;
import com.spendwise.entity.TransactionType;
import com.spendwise.entity.User;
import com.spendwise.exception.BadRequestException;
import com.spendwise.exception.ResourceNotFoundException;
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
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private TransactionService transactionService;

    private User user;
    private Category expenseCat;
    private Category incomeCat;

    @BeforeEach
    void setUp() {
        user = new User("Jane Doe", "jane@example.com", "hash");
        user.setId(2L);

        expenseCat = new Category(null, "Groceries", TransactionType.EXPENSE, "ShoppingCart", "#10B981", true);
        expenseCat.setId(10L);

        incomeCat = new Category(null, "Salary", TransactionType.INCOME, "Briefcase", "#3B82F6", true);
        incomeCat.setId(20L);
    }

    @Test
    @DisplayName("Should create transaction with correct scale and details")
    void shouldCreateTransactionSuccessfully() {
        TransactionRequest request = new TransactionRequest(
                TransactionType.EXPENSE,
                new BigDecimal("1250.50"),
                "Weekly Vegetables",
                10L,
                LocalDate.of(2026, 10, 10),
                "UPI",
                "Local store"
        );

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(categoryRepository.findAvailableByIdAndUser(10L, 2L)).thenReturn(Optional.of(expenseCat));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(inv -> {
            Transaction t = inv.getArgument(0);
            t.setId(100L);
            return t;
        });

        TransactionResponse response = transactionService.createTransaction(2L, request);

        assertNotNull(response);
        assertEquals(100L, response.getId());
        assertEquals(new BigDecimal("1250.50"), response.getAmount());
        assertEquals("Groceries", response.getCategoryName());
        assertEquals(TransactionType.EXPENSE, response.getType());
    }

    @Test
    @DisplayName("Should reject transaction when category type does not match transaction type")
    void shouldRejectCategoryTypeMismatch() {
        TransactionRequest request = new TransactionRequest(
                TransactionType.INCOME, // Trying to record Income with an Expense category
                new BigDecimal("5000.00"),
                "Salary Deposit",
                10L, // expenseCat
                LocalDate.of(2026, 10, 10),
                "Bank Transfer",
                null
        );

        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(categoryRepository.findAvailableByIdAndUser(10L, 2L)).thenReturn(Optional.of(expenseCat));

        assertThrows(BadRequestException.class, () -> transactionService.createTransaction(2L, request));
        verify(transactionRepository, never()).save(any());
    }

    @Test
    @DisplayName("Should enforce ownership when fetching transaction")
    void shouldThrowWhenTransactionBelongsToAnotherUser() {
        when(transactionRepository.findByIdAndUserId(999L, 2L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> transactionService.getTransaction(2L, 999L));
    }
}
