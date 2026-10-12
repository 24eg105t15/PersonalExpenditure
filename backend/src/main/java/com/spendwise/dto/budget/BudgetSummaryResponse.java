package com.spendwise.dto.budget;

import java.math.BigDecimal;
import java.util.List;

public class BudgetSummaryResponse {
    private BigDecimal totalBudget;
    private BigDecimal totalSpending;
    private BigDecimal remainingBudget;
    private double overallUtilization;
    private int month;
    private int year;
    private List<BudgetResponse> budgets;

    public BudgetSummaryResponse() {}

    public BudgetSummaryResponse(BigDecimal totalBudget, BigDecimal totalSpending, BigDecimal remainingBudget,
                                 double overallUtilization, int month, int year, List<BudgetResponse> budgets) {
        this.totalBudget = totalBudget;
        this.totalSpending = totalSpending;
        this.remainingBudget = remainingBudget;
        this.overallUtilization = overallUtilization;
        this.month = month;
        this.year = year;
        this.budgets = budgets;
    }

    public BigDecimal getTotalBudget() {
        return totalBudget;
    }

    public void setTotalBudget(BigDecimal totalBudget) {
        this.totalBudget = totalBudget;
    }

    public BigDecimal getTotalSpending() {
        return totalSpending;
    }

    public void setTotalSpending(BigDecimal totalSpending) {
        this.totalSpending = totalSpending;
    }

    public BigDecimal getRemainingBudget() {
        return remainingBudget;
    }

    public void setRemainingBudget(BigDecimal remainingBudget) {
        this.remainingBudget = remainingBudget;
    }

    public double getOverallUtilization() {
        return overallUtilization;
    }

    public void setOverallUtilization(double overallUtilization) {
        this.overallUtilization = overallUtilization;
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

    public List<BudgetResponse> getBudgets() {
        return budgets;
    }

    public void setBudgets(List<BudgetResponse> budgets) {
        this.budgets = budgets;
    }
}
