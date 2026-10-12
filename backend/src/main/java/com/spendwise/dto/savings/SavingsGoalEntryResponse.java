package com.spendwise.dto.savings;

import com.spendwise.entity.SavingsEntryType;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

public class SavingsGoalEntryResponse {
    private Long id;
    private Long savingsGoalId;
    private SavingsEntryType type;
    private BigDecimal amount;
    private String notes;
    private LocalDate entryDate;
    private Instant createdAt;

    public SavingsGoalEntryResponse() {}

    public SavingsGoalEntryResponse(Long id, Long savingsGoalId, SavingsEntryType type, BigDecimal amount,
                                    String notes, LocalDate entryDate, Instant createdAt) {
        this.id = id;
        this.savingsGoalId = savingsGoalId;
        this.type = type;
        this.amount = amount;
        this.notes = notes;
        this.entryDate = entryDate;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getSavingsGoalId() {
        return savingsGoalId;
    }

    public void setSavingsGoalId(Long savingsGoalId) {
        this.savingsGoalId = savingsGoalId;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
