package com.spendwise.dto.budget;

import java.math.BigDecimal;
import java.time.Instant;

public class BudgetResponse {
    private Long id;
    private Long categoryId;
    private String categoryName;
    private String categoryIcon;
    private String categoryColor;
    private BigDecimal amount;
    private BigDecimal actualSpending;
    private BigDecimal remainingAmount;
    private double utilizationPercentage;
    private int month;
    private int year;
    private int warningThreshold;
    private String status; // NORMAL, WARNING, EXCEEDED
    private Instant createdAt;

    public BudgetResponse() {}

    public BudgetResponse(Long id, Long categoryId, String categoryName, String categoryIcon, String categoryColor,
                          BigDecimal amount, BigDecimal actualSpending, BigDecimal remainingAmount,
                          double utilizationPercentage, int month, int year, int warningThreshold,
                          String status, Instant createdAt) {
        this.id = id;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.categoryIcon = categoryIcon;
        this.categoryColor = categoryColor;
        this.amount = amount;
        this.actualSpending = actualSpending;
        this.remainingAmount = remainingAmount;
        this.utilizationPercentage = utilizationPercentage;
        this.month = month;
        this.year = year;
        this.warningThreshold = warningThreshold;
        this.status = status;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getCategoryIcon() {
        return categoryIcon;
    }

    public void setCategoryIcon(String categoryIcon) {
        this.categoryIcon = categoryIcon;
    }

    public String getCategoryColor() {
        return categoryColor;
    }

    public void setCategoryColor(String categoryColor) {
        this.categoryColor = categoryColor;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getActualSpending() {
        return actualSpending;
    }

    public void setActualSpending(BigDecimal actualSpending) {
        this.actualSpending = actualSpending;
    }

    public BigDecimal getRemainingAmount() {
        return remainingAmount;
    }

    public void setRemainingAmount(BigDecimal remainingAmount) {
        this.remainingAmount = remainingAmount;
    }

    public double getUtilizationPercentage() {
        return utilizationPercentage;
    }

    public void setUtilizationPercentage(double utilizationPercentage) {
        this.utilizationPercentage = utilizationPercentage;
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

    public int getWarningThreshold() {
        return warningThreshold;
    }

    public void setWarningThreshold(int warningThreshold) {
        this.warningThreshold = warningThreshold;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
