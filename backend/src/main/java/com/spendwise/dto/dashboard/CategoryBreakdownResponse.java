package com.spendwise.dto.dashboard;

import java.math.BigDecimal;

public class CategoryBreakdownResponse {
    private Long categoryId;
    private String categoryName;
    private String color;
    private String icon;
    private BigDecimal amount;
    private double percentage;
    private long transactionCount;

    public CategoryBreakdownResponse() {}

    public CategoryBreakdownResponse(Long categoryId, String categoryName, String color, String icon,
                                     BigDecimal amount, double percentage, long transactionCount) {
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.color = color;
        this.icon = icon;
        this.amount = amount;
        this.percentage = percentage;
        this.transactionCount = transactionCount;
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public double getPercentage() {
        return percentage;
    }

    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }

    public long getTransactionCount() {
        return transactionCount;
    }

    public void setTransactionCount(long transactionCount) {
        this.transactionCount = transactionCount;
    }
}
