package com.spendwise.dto.dashboard;

import java.math.BigDecimal;

public class CashFlowResponse {
    private String period; // e.g. "2026-07" or "Jul 2026"
    private BigDecimal income;
    private BigDecimal expense;
    private BigDecimal net;

    public CashFlowResponse() {}

    public CashFlowResponse(String period, BigDecimal income, BigDecimal expense, BigDecimal net) {
        this.period = period;
        this.income = income;
        this.expense = expense;
        this.net = net;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public BigDecimal getIncome() {
        return income;
    }

    public void setIncome(BigDecimal income) {
        this.income = income;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public BigDecimal getNet() {
        return net;
    }

    public void setNet(BigDecimal net) {
        this.net = net;
    }
}
