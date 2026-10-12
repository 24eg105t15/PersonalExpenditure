package com.spendwise.service;

import com.spendwise.dto.budget.BudgetResponse;
import com.spendwise.dto.dashboard.CashFlowResponse;
import com.spendwise.dto.dashboard.CategoryBreakdownResponse;
import com.spendwise.dto.report.MonthlyReportResponse;
import com.spendwise.dto.report.SpendingTrendItem;
import com.spendwise.entity.TransactionType;
import com.spendwise.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReportService {

    private final TransactionRepository transactionRepository;
    private final DashboardService dashboardService;
    private final BudgetService budgetService;

    public ReportService(TransactionRepository transactionRepository,
                         DashboardService dashboardService,
                         BudgetService budgetService) {
        this.transactionRepository = transactionRepository;
        this.dashboardService = dashboardService;
        this.budgetService = budgetService;
    }

    @Transactional(readOnly = true)
    public MonthlyReportResponse getMonthlyReport(Long userId, int month, int year) {
        YearMonth ym = YearMonth.of(year, month);
        LocalDate startDate = ym.atDay(1);
        LocalDate endDate = ym.atEndOfMonth();

        BigDecimal totalIncome = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                userId, TransactionType.INCOME, startDate, endDate
        );
        if (totalIncome == null) totalIncome = BigDecimal.ZERO;

        BigDecimal totalExpense = transactionRepository.sumAmountByUserIdAndTypeAndDateBetween(
                userId, TransactionType.EXPENSE, startDate, endDate
        );
        if (totalExpense == null) totalExpense = BigDecimal.ZERO;

        BigDecimal netSavings = totalIncome.subtract(totalExpense);
        double savingsRate = 0.0;
        if (totalIncome.compareTo(BigDecimal.ZERO) > 0 && netSavings.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = netSavings.multiply(BigDecimal.valueOf(100))
                    .divide(totalIncome, 1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        List<CategoryBreakdownResponse> categoryBreakdown =
                dashboardService.getCategoryBreakdown(userId, TransactionType.EXPENSE, startDate, endDate);

        // Daily spending trend
        List<Object[]> rawDaily = transactionRepository.findDailyExpenseTrend(userId, startDate, endDate);
        List<SpendingTrendItem> dailyTrends = new ArrayList<>();
        for (Object[] row : rawDaily) {
            LocalDate date = (LocalDate) row[0];
            BigDecimal amt = (BigDecimal) row[1];
            dailyTrends.add(new SpendingTrendItem(date, amt));
        }

        // Budget performance for the month
        List<BudgetResponse> budgetPerformance = budgetService.getBudgets(userId, month, year);

        return new MonthlyReportResponse(
                month,
                year,
                totalIncome,
                totalExpense,
                netSavings,
                savingsRate,
                categoryBreakdown,
                dailyTrends,
                budgetPerformance
        );
    }

    @Transactional(readOnly = true)
    public List<CashFlowResponse> getAnnualCashFlowReport(Long userId, int year) {
        LocalDate startDate = LocalDate.of(year, 1, 1);
        LocalDate endDate = LocalDate.of(year, 12, 31);
        return dashboardService.getCashFlow(userId, 12);
    }
}
