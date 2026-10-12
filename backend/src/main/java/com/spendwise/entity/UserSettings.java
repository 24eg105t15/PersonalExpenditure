package com.spendwise.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_settings")
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(nullable = false, length = 10)
    private String currency = "INR";

    @Column(name = "date_format", nullable = false, length = 20)
    private String dateFormat = "DD/MM/YYYY";

    @Column(nullable = false, length = 20)
    private String theme = "light";

    @Column(name = "monthly_budget_alert", nullable = false)
    private boolean monthlyBudgetAlert = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public UserSettings() {}

    public UserSettings(User user) {
        this.user = user;
        this.currency = "INR";
        this.dateFormat = "DD/MM/YYYY";
        this.theme = "light";
        this.monthlyBudgetAlert = true;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
