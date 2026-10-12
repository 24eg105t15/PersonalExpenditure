package com.spendwise.dto.profile;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SettingsRequest {

    @NotBlank(message = "Currency code is required")
    @Size(min = 3, max = 5, message = "Currency must be between 3 and 5 characters")
    private String currency;

    @NotBlank(message = "Date format is required")
    private String dateFormat;

    @NotBlank(message = "Theme is required")
    private String theme;

    private boolean monthlyBudgetAlert;

    public SettingsRequest() {}

    public SettingsRequest(String currency, String dateFormat, String theme, boolean monthlyBudgetAlert) {
        this.currency = currency;
        this.dateFormat = dateFormat;
        this.theme = theme;
        this.monthlyBudgetAlert = monthlyBudgetAlert;
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
