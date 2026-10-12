package com.spendwise.dto.savings;

import com.spendwise.entity.SavingsEntryType;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SavingsGoalEntryRequest {

    @NotNull(message = "Entry type is required")
    private SavingsEntryType type;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount must be greater than zero")
    @Digits(integer = 13, fraction = 2, message = "Amount can have at most 2 decimal places")
    private BigDecimal amount;

    @Size(max = 255, message = "Notes cannot exceed 255 characters")
    private String notes;

    @NotNull(message = "Entry date is required")
    private LocalDate entryDate;

    public SavingsGoalEntryRequest() {}

    public SavingsGoalEntryRequest(SavingsEntryType type, BigDecimal amount, String notes, LocalDate entryDate) {
        this.type = type;
        this.amount = amount;
        this.notes = notes;
        this.entryDate = entryDate;
    }

    public SavingsEntryType getType() {
        return type;
    }

    public void setType(SavingsEntryType type) {
        this.type = type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }
}
