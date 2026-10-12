package com.spendwise.dto.category;

import com.spendwise.entity.TransactionType;

import java.time.Instant;

public class CategoryResponse {
    private Long id;
    private String name;
    private TransactionType type;
    private String icon;
    private String color;
    private boolean isDefault;
    private boolean isCustom;
    private Instant createdAt;

    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, TransactionType type, String icon, String color,
                            boolean isDefault, boolean isCustom, Instant createdAt) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.icon = icon;
        this.color = color;
        this.isDefault = isDefault;
        this.isCustom = isCustom;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TransactionType getType() {
        return type;
    }

    public void setType(TransactionType type) {
        this.type = type;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isDefault() {
        return isDefault;
    }

    public void setDefault(boolean aDefault) {
        isDefault = aDefault;
    }

    public boolean isCustom() {
        return isCustom;
    }

    public void setCustom(boolean custom) {
        isCustom = custom;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
