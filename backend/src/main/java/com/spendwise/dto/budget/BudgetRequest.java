package com.spendwise.dto.budget;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class BudgetRequest {

    @NotNull(message = "Category is required")
    private Long categoryId;

    @NotNull(message = "Budget amount is required")
    @DecimalMin(value = "0.01", message = "Budget amount must be greater than zero")
    @Digits(integer = 13, fraction = 2, message = "Amount can have at most 2 decimal places")
    private BigDecimal amount;

    @Min(value = 1, message = "Month must be between 1 and 12")
    @Max(value = 12, message = "Month must be between 1 and 12")
    private int month;

    @Min(value = 2000, message = "Year must be 2000 or later")
    @Max(value = 2100, message = "Year must be 2100 or earlier")
    private int year;

    @Min(value = 1, message = "Threshold must be at least 1%")
    @Max(value = 100, message = "Threshold cannot exceed 100%")
    private int warningThreshold = 80;

    public BudgetRequest() {}

    public BudgetRequest(Long categoryId, BigDecimal amount, int month, int year, int warningThreshold) {
        this.categoryId = categoryId;
        this.amount = amount;
        this.month = month;
        this.year = year;
        this.warningThreshold = warningThreshold;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
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
}
