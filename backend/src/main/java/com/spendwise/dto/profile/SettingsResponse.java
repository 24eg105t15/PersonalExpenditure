package com.spendwise.dto.profile;

public class SettingsResponse {
    private Long id;
    private String currency;
    private String dateFormat;
    private String theme;
    private boolean monthlyBudgetAlert;

    public SettingsResponse() {}

    public SettingsResponse(Long id, String currency, String dateFormat, String theme, boolean monthlyBudgetAlert) {
        this.id = id;
        this.currency = currency;
        this.dateFormat = dateFormat;
        this.theme = theme;
        this.monthlyBudgetAlert = monthlyBudgetAlert;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(String dateFormat) {
        this.dateFormat = dateFormat;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public boolean isMonthlyBudgetAlert() {
        return monthlyBudgetAlert;
    }

    public void setMonthlyBudgetAlert(boolean monthlyBudgetAlert) {
        this.monthlyBudgetAlert = monthlyBudgetAlert;
    }
}
