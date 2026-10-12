package com.spendwise.dto.dashboard;

import java.math.BigDecimal;
import java.time.LocalDate;

public class DashboardSummaryResponse {
    private BigDecimal totalIncome;
    private BigDecimal totalExpenses;
    private BigDecimal netCashFlow;
    private BigDecimal availableBalance;
    private BigDecimal totalSavings;
    private int savingsGoalsCount;
    private BigDecimal totalBudget;
    private BigDecimal totalBudgetSpending;
    private double budgetUtilization;
    private String periodDescription;
    private LocalDate startDate;
    private LocalDate endDate;

    public DashboardSummaryResponse() {}

    public DashboardSummaryResponse(BigDecimal totalIncome, BigDecimal totalExpenses, BigDecimal netCashFlow,
                                    BigDecimal availableBalance, BigDecimal totalSavings, int savingsGoalsCount,
                                    BigDecimal totalBudget, BigDecimal totalBudgetSpending, double budgetUtilization,
                                    String periodDescription, LocalDate startDate, LocalDate endDate) {
        this.totalIncome = totalIncome;
        this.totalExpenses = totalExpenses;
        this.netCashFlow = netCashFlow;
        this.availableBalance = availableBalance;
        this.totalSavings = totalSavings;
        this.savingsGoalsCount = savingsGoalsCount;
        this.totalBudget = totalBudget;
        this.totalBudgetSpending = totalBudgetSpending;
        this.budgetUtilization = budgetUtilization;
        this.periodDescription = periodDescription;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(BigDecimal totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public BigDecimal getNetCashFlow() {
        return netCashFlow;
    }

    public void setNetCashFlow(BigDecimal netCashFlow) {
        this.netCashFlow = netCashFlow;
    }

    public BigDecimal getAvailableBalance() {
        return availableBalance;
    }

    public void setAvailableBalance(BigDecimal availableBalance) {
        this.availableBalance = availableBalance;
    }

    public BigDecimal getTotalSavings() {
        return totalSavings;
    }

    public void setTotalSavings(BigDecimal totalSavings) {
        this.totalSavings = totalSavings;
    }

    public int getSavingsGoalsCount() {
        return savingsGoalsCount;
    }

    public void setSavingsGoalsCount(int savingsGoalsCount) {
        this.savingsGoalsCount = savingsGoalsCount;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getTotalBudgetSpending() {
        return totalBudgetSpending;
    }

    public void setTotalBudgetSpending(BigDecimal totalBudgetSpending) {
        this.totalBudgetSpending = totalBudgetSpending;
    }

    public double getBudgetUtilization() {
        return budgetUtilization;
    }

    public void setBudgetUtilization(double budgetUtilization) {
        this.budgetUtilization = budgetUtilization;
    }

    public String getPeriodDescription() {
        return periodDescription;
    }

    public void setPeriodDescription(String periodDescription) {
        this.periodDescription = periodDescription;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }
}
