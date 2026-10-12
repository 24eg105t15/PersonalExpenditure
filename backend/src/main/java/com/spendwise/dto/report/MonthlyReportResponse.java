package com.spendwise.dto.report;

import com.spendwise.dto.budget.BudgetResponse;
import com.spendwise.dto.dashboard.CategoryBreakdownResponse;

import java.math.BigDecimal;
import java.util.List;

public class MonthlyReportResponse {
    private int month;
    private int year;
    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal netSavings;
    private double savingsRate; // percentage
    private List<CategoryBreakdownResponse> categoryBreakdown;
    private List<SpendingTrendItem> dailyTrends;
    private List<BudgetResponse> budgetPerformance;

    public MonthlyReportResponse() {}

    public MonthlyReportResponse(int month, int year, BigDecimal totalIncome, BigDecimal totalExpense,
                                 BigDecimal netSavings, double savingsRate,
                                 List<CategoryBreakdownResponse> categoryBreakdown,
                                 List<SpendingTrendItem> dailyTrends,
                                 List<BudgetResponse> budgetPerformance) {
        this.month = month;
        this.year = year;
        this.totalIncome = totalIncome;
        this.totalExpense = totalExpense;
        this.netSavings = netSavings;
        this.savingsRate = savingsRate;
        this.categoryBreakdown = categoryBreakdown;
        this.dailyTrends = dailyTrends;
        this.budgetPerformance = budgetPerformance;
    }

    public int getMonth() {
        return month;
    }

    public void setMonth(int month) {
        this.month = month;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getNetSavings() {
        return netSavings;
    }

    public void setNetSavings(BigDecimal netSavings) {
        this.netSavings = netSavings;
    }

    public double getSavingsRate() {
        return savingsRate;
    }

    public void setSavingsRate(double savingsRate) {
        this.savingsRate = savingsRate;
    }

    public List<CategoryBreakdownResponse> getCategoryBreakdown() {
        return categoryBreakdown;
    }

    public void setCategoryBreakdown(List<CategoryBreakdownResponse> categoryBreakdown) {
        this.categoryBreakdown = categoryBreakdown;
    }

    public List<SpendingTrendItem> getDailyTrends() {
        return dailyTrends;
    }

    public void setDailyTrends(List<SpendingTrendItem> dailyTrends) {
        this.dailyTrends = dailyTrends;
    }

    public List<BudgetResponse> getBudgetPerformance() {
        return budgetPerformance;
    }

    public void setBudgetPerformance(List<BudgetResponse> budgetPerformance) {
        this.budgetPerformance = budgetPerformance;
    }
}
