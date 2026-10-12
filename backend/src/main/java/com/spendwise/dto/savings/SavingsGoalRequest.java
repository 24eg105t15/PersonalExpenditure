package com.spendwise.dto.savings;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SavingsGoalRequest {

    @NotBlank(message = "Goal name is required")
    @Size(min = 2, max = 100, message = "Goal name must be between 2 and 100 characters")
    private String name;

    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @NotNull(message = "Target amount is required")
    @DecimalMin(value = "1.00", message = "Target amount must be at least 1.00")
    @Digits(integer = 13, fraction = 2, message = "Target amount can have at most 2 decimal places")
    private BigDecimal targetAmount;

    @DecimalMin(value = "0.00", message = "Initial amount cannot be negative")
    @Digits(integer = 13, fraction = 2, message = "Initial amount can have at most 2 decimal places")
    private BigDecimal initialAmount = BigDecimal.ZERO;

    @NotNull(message = "Target date is required")
    private LocalDate targetDate;

    public SavingsGoalRequest() {}

    public SavingsGoalRequest(String name, String description, BigDecimal targetAmount,
                              BigDecimal initialAmount, LocalDate targetDate) {
        this.name = name;
        this.description = description;
        this.targetAmount = targetAmount;
        this.initialAmount = initialAmount != null ? initialAmount : BigDecimal.ZERO;
        this.targetDate = targetDate;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getTargetAmount() {
        return targetAmount;
    }

    public void setTargetAmount(BigDecimal targetAmount) {
        this.targetAmount = targetAmount;
    }

    public BigDecimal getInitialAmount() {
        return initialAmount;
    }

    public void setInitialAmount(BigDecimal initialAmount) {
        this.initialAmount = initialAmount;
    }

    public LocalDate getTargetDate() {
        return targetDate;
    }

    public void setTargetDate(LocalDate targetDate) {
        this.targetDate = targetDate;
    }
}
