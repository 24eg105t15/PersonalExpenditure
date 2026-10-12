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
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.TransactionRepository;
import com.spendwise.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public BudgetService(BudgetRepository budgetRepository,
                         CategoryRepository categoryRepository,
                         TransactionRepository transactionRepository,
                         UserRepository userRepository) {
        this.budgetRepository = budgetRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public BudgetResponse createBudget(Long userId, BudgetRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findAvailableByIdAndUser(request.getCategoryId(), userId)
                .orElseThrow(() -> new BadRequestException("Category not found or not accessible"));

        if (category.getType() != TransactionType.EXPENSE) {
            throw new BadRequestException("Budgets can only be set for EXPENSE categories");
        }

        if (budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(userId, category.getId(), request.getMonth(), request.getYear())) {
            throw new DuplicateResourceException("A budget for category '" + category.getName() + "' already exists for " + request.getMonth() + "/" + request.getYear());
        }

        BigDecimal scaledAmount = request.getAmount().setScale(2, RoundingMode.HALF_UP);
        Budget budget = new Budget(user, category, scaledAmount, request.getMonth(), request.getYear(), request.getWarningThreshold());
        Budget saved = budgetRepository.save(budget);

        return buildBudgetResponse(saved, userId);
    }

    @Transactional
    public BudgetResponse updateBudget(Long userId, Long budgetId, BudgetRequest request) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));

        Category category = categoryRepository.findAvailableByIdAndUser(request.getCategoryId(), userId)
                .orElseThrow(() -> new BadRequestException("Category not found or not accessible"));

        if (category.getType() != TransactionType.EXPENSE) {
            throw new BadRequestException("Budgets can only be set for EXPENSE categories");
        }

        // If category or month or year changed, verify uniqueness
        if (!budget.getCategory().getId().equals(category.getId()) ||
                budget.getMonth() != request.getMonth() ||
                budget.getYear() != request.getYear()) {
            if (budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(userId, category.getId(), request.getMonth(), request.getYear())) {
                throw new DuplicateResourceException("A budget for category '" + category.getName() + "' already exists for " + request.getMonth() + "/" + request.getYear());
            }
        }

        budget.setCategory(category);
        budget.setAmount(request.getAmount().setScale(2, RoundingMode.HALF_UP));
        budget.setMonth(request.getMonth());
        budget.setYear(request.getYear());
        budget.setWarningThreshold(request.getWarningThreshold());

        Budget updated = budgetRepository.save(budget);
        return buildBudgetResponse(updated, userId);
    }

    @Transactional
    public void deleteBudget(Long userId, Long budgetId) {
        Budget budget = budgetRepository.findByIdAndUserId(budgetId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Budget not found"));
        budgetRepository.delete(budget);
    }

    @Transactional(readOnly = true)
    public List<BudgetResponse> getBudgets(Long userId, int month, int year) {
        List<Budget> budgets = budgetRepository.findByUserIdAndMonthAndYear(userId, month, year);
        return budgets.stream()
                .map(b -> buildBudgetResponse(b, userId))
                .toList();
    }

    @Transactional(readOnly = true)
    public BudgetSummaryResponse getBudgetSummary(Long userId, int month, int year) {
        List<BudgetResponse> budgetResponses = getBudgets(userId, month, year);

        BigDecimal totalBudget = BigDecimal.ZERO;
        BigDecimal totalSpending = BigDecimal.ZERO;

        for (BudgetResponse br : budgetResponses) {
            totalBudget = totalBudget.add(br.getAmount());
            totalSpending = totalSpending.add(br.getActualSpending());
        }

        BigDecimal remainingBudget = totalBudget.subtract(totalSpending);
        double overallUtilization = 0.0;
        if (totalBudget.compareTo(BigDecimal.ZERO) > 0) {
            overallUtilization = totalSpending.multiply(BigDecimal.valueOf(100))
                    .divide(totalBudget, 1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return new BudgetSummaryResponse(
                totalBudget,
                totalSpending,
                remainingBudget,
                overallUtilization,
                month,
                year,
                budgetResponses
        );
    }

    private BudgetResponse buildBudgetResponse(Budget budget, Long userId) {
        YearMonth ym = YearMonth.of(budget.getYear(), budget.getMonth());
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        BigDecimal actualSpending = transactionRepository.sumExpenseByUserIdAndCategoryAndDateBetween(
                userId, budget.getCategory().getId(), startDate, endDate
        );
        if (actualSpending == null) actualSpending = BigDecimal.ZERO;

        BigDecimal remaining = budget.getAmount().subtract(actualSpending);
        double utilization = 0.0;
        if (budget.getAmount().compareTo(BigDecimal.ZERO) > 0) {
            utilization = actualSpending.multiply(BigDecimal.valueOf(100))
                    .divide(budget.getAmount(), 1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        String status = "NORMAL";
        if (utilization >= 100.0) {
            status = "EXCEEDED";
        } else if (utilization >= budget.getWarningThreshold()) {
            status = "WARNING";
        }

        return new BudgetResponse(
                budget.getId(),
                budget.getCategory().getId(),
                budget.getCategory().getName(),
                budget.getCategory().getIcon(),
                budget.getCategory().getColor(),
                budget.getAmount(),
                actualSpending,
                remaining,
                utilization,
                budget.getMonth(),
                budget.getYear(),
                budget.getWarningThreshold(),
                status,
                budget.getCreatedAt()
        );
    }
}
