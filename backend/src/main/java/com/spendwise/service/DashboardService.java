package com.spendwise.service;

import com.spendwise.dto.dashboard.CashFlowResponse;
import com.spendwise.dto.dashboard.CategoryBreakdownResponse;
import com.spendwise.dto.dashboard.DashboardSummaryResponse;
import com.spendwise.dto.transaction.TransactionResponse;
import com.spendwise.entity.SavingsGoal;
import com.spendwise.entity.SavingsGoalStatus;
import com.spendwise.entity.TransactionType;
import com.spendwise.repository.BudgetRepository;
import com.spendwise.repository.SavingsGoalRepository;
import com.spendwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final BudgetService budgetService;
    private final TransactionService transactionService;

    public DashboardService(TransactionRepository transactionRepository,
                            SavingsGoalRepository savingsGoalRepository,
                            BudgetService budgetService,
                            TransactionService transactionService) {
        this.transactionRepository = transactionRepository;
        this.savingsGoalRepository = savingsGoalRepository;
        this.budgetService = budgetService;
        this.transactionService = transactionService;
    }

    @Transactional(readOnly = true)
    public DashboardSummaryResponse getSummary(Long userId, String period, LocalDate customStart, LocalDate customEnd) {
        LocalDate startDate;
        LocalDate endDate;
        String periodDesc;

        LocalDate today = LocalDate.now();

        if ("previous_month".equalsIgnoreCase(period)) {
            YearMonth prevYm = YearMonth.from(today.minusMonths(1));
            startDate = prevYm.atDay(1);
            endDate = prevYm.atEndOfMonth();
            periodDesc = "Previous Month (" + startDate.format(DateTimeFormatter.ofPattern("MMM yyyy")) + ")";
        } else if ("current_year".equalsIgnoreCase(period)) {
            startDate = LocalDate.of(today.getYear(), 1, 1);
            endDate = LocalDate.of(today.getYear(), 12, 31);
            periodDesc = "Current Year (" + today.getYear() + ")";
        } else if ("custom".equalsIgnoreCase(period) && customStart != null && customEnd != null) {
            startDate = customStart;
            endDate = customEnd;
            periodDesc = "Custom (" + startDate + " to " + endDate + ")";
        } else {
            // Default: current_month
            YearMonth currentYm = YearMonth.from(today);
            startDate = currentYm.atDay(1);
            endDate = currentYm.atEndOfMonth();
            periodDesc = "Current Month (" + startDate.format(DateTimeFormatter.ofPattern("MMM yyyy")) + ")";
        }

        BigDecimal totalIncome = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                userId, TransactionType.INCOME, startDate, endDate
        );
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;

        BigDecimal totalExpenses = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startDate, endDate
        );
        if (totalExpenses == null) totalExpenses = BigDecimal.ZERO;

        BigDecimal netCashFlow = totalIncome.subtract(totalExpenses);

        // Cumulative Available Balance = All-time Income - All-time Expense
        BigDecimal allTimeIncome = transactionRepository.sumAmountByUserIdAndType(userId, TransactionType.INCOME);
        if (allTimeIncome == null) allTimeIncome = BigDecimal.ZERO;
        BigDecimal allTimeExpense = transactionRepository.sumAmountByUserIdAndType(userId, TransactionType.EXPENSE);
        if (allTimeExpense == null) allTimeExpense = BigDecimal.ZERO;
        BigDecimal availableBalance = allTimeIncome.subtract(allTimeExpense);

        // Savings Goals
        List<SavingsGoal> goals = savingsGoalRepository.findByUserIdOrderByCreatedAtDesc(userId);
        BigDecimal totalSavings = BigDecimal.ZERO;
        int activeGoalsCount = 0;
        for (SavingsGoal g : goals) {
            if (g.getStatus() != SavingsGoalStatus.ARCHIVED) {
                totalSavings = totalSavings.add(g.getCurrentAmount());
                activeGoalsCount++;
            }
        }

        // Budget utilization for the period's month/year
        int budgetMonth = startDate.getMonthValue();
        int budgetYear = startDate.getYear();
        var budgetSummary = budgetService.getBudgetSummary(userId, budgetMonth, budgetYear);

        return new DashboardSummaryResponse(
                totalIncome,
                totalExpenses,
                netCashFlow,
                availableBalance,
                totalSavings,
                activeGoalsCount,
                budgetSummary.getTotalBudget(),
                budgetSummary.getTotalSpending(),
                budgetSummary.getOverallUtilization(),
                periodDesc,
                startDate,
                endDate
        );
    }

    @Transactional(readOnly = true)
    public List<CashFlowResponse> getCashFlow(Long userId, int months) {
        if (months <= 0) months = 6;
        LocalDate endDate = LocalDate.now();
        LocalDate startDate = endDate.minusMonths(months - 1).withDayOfMonth(1);

        List<Object[]> rawFlow = transactionRepository.findMonthlyCashFlow(userId, startDate, endDate);

        // Map key: "yyyy-MM" -> [income, expense]
        Map<String, BigDecimal[]> flowMap = new HashMap<>();
        for (Object[] row : rawFlow) {
            int yr = ((Number) row[0]).intValue();
            int mo = ((Number) row[1]).intValue();
            TransactionType type = (TransactionType) row[2];
            BigDecimal amt = (BigDecimal) row[3];

            String key = String.format("%04d-%02d", yr, mo);
            flowMap.putIfAbsent(key, new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
            if (type == TransactionType.INCOME) {
                flowMap.get(key)[0] = flowMap.get(key)[0].add(amt);
            } else {
                flowMap.get(key)[1] = flowMap.get(key)[1].add(amt);
            }
        }

        List<CashFlowResponse> result = new ArrayList<>();
        DateTimeFormatter displayFmt = DateTimeFormatter.ofPattern("MMM yyyy");
        LocalDate cur = startDate;
        while (!cur.isAfter(endDate)) {
            String key = String.format("%04d-%02d", cur.getYear(), cur.getMonthValue());
            String displayLabel = cur.format(displayFmt);
            BigDecimal[] vals = flowMap.getOrDefault(key, new BigDecimal[]{BigDecimal.ZERO, BigDecimal.ZERO});
            BigDecimal inc = vals[0];
            BigDecimal exp = vals[1];
            BigDecimal net = inc.subtract(exp);

            result.add(new CashFlowResponse(displayLabel, inc, exp, net));
            cur = cur.plusMonths(1);
        }

        return result;
    }

    @Transactional(readOnly = true)
    public List<CategoryBreakdownResponse> getCategoryBreakdown(Long userId, TransactionType type, LocalDate startDate, LocalDate endDate) {
        if (type == null) type = TransactionType.EXPENSE;
        if (startDate == null) startDate = LocalDate.now().withDayOfMonth(1);
        if (endDate == null) endDate = LocalDate.now().withDayOfMonth(LocalDate.now().lengthOfMonth());

        List<Object[]> rawData = transactionRepository.findCategoryBreakdown(userId, type, startDate, endDate);

        BigDecimal grandTotal = BigDecimal.ZERO;
        for (Object[] row : rawData) {
            BigDecimal amt = (BigDecimal) row[4];
            grandTotal = grandTotal.add(amt);
        }

        List<CategoryBreakdownResponse> response = new ArrayList<>();
        for (Object[] row : rawData) {
            Long catId = ((Number) row[0]).longValue();
            String catName = (String) row[1];
            String color = (String) row[2];
            String icon = (String) row[3];
            BigDecimal amt = (BigDecimal) row[4];
            long count = ((Number) row[5]).longValue();

            double percentage = 0.0;
            if (grandTotal.compareTo(BigDecimal.ZERO) > 0) {
                percentage = amt.multiply(BigDecimal.valueOf(100))
                        .divide(grandTotal, 1, RoundingMode.HALF_UP)
                        .doubleValue();
            }

            response.add(new CategoryBreakdownResponse(
                    catId, catName, color, icon, amt, percentage, count
            ));
        }

        return response;
    }

    @Transactional(readOnly = true)
    public List<TransactionResponse> getRecentTransactions(Long userId) {
        return transactionRepository.findTop5ByUserIdOrderByTransactionDateDescCreatedAtDesc(userId).stream()
                .map(transactionService::mapToResponse)
                .toList();
    }
}
