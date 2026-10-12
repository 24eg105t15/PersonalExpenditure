package com.spendwise.dto.report;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SpendingTrendItem {
    private LocalDate date;
    private BigDecimal amount;

    public SpendingTrendItem() {}

    public SpendingTrendItem(LocalDate date, BigDecimal amount) {
        this.date = date;
        this.amount = amount;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
