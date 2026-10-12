package com.spendwise.controller;

import com.spendwise.dto.common.ApiResponse;
import com.spendwise.dto.savings.SavingsGoalEntryRequest;
import com.spendwise.dto.savings.SavingsGoalEntryResponse;
import com.spendwise.dto.savings.SavingsGoalRequest;
import com.spendwise.dto.savings.SavingsGoalResponse;
import com.spendwise.security.UserPrincipal;
import com.spendwise.service.SavingsGoalService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/savings-goals")
public class SavingsGoalController {

    private final SavingsGoalService savingsGoalService;

    public SavingsGoalController(SavingsGoalService savingsGoalService) {
        this.savingsGoalService = savingsGoalService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<SavingsGoalResponse>>> getGoals(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<SavingsGoalResponse> response = savingsGoalService.getGoals(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> createGoal(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SavingsGoalRequest request) {
        SavingsGoalResponse response = savingsGoalService.createGoal(userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Savings goal created successfully", response));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> getGoal(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        SavingsGoalResponse response = savingsGoalService.getGoal(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> updateGoal(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody SavingsGoalRequest request) {
        SavingsGoalResponse response = savingsGoalService.updateGoal(userPrincipal.getId(), id, request);
        return ResponseEntity.ok(ApiResponse.success("Savings goal updated successfully", response));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteGoal(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        savingsGoalService.deleteGoal(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success("Savings goal deleted successfully", null));
    }

    @PostMapping("/{id}/entries")
    public ResponseEntity<ApiResponse<SavingsGoalResponse>> addEntry(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @Valid @RequestBody SavingsGoalEntryRequest request) {
        SavingsGoalResponse response = savingsGoalService.addEntry(userPrincipal.getId(), id, request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Goal entry recorded successfully", response));
    }

    @GetMapping("/{id}/entries")
    public ResponseEntity<ApiResponse<List<SavingsGoalEntryResponse>>> getEntries(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        List<SavingsGoalEntryResponse> response = savingsGoalService.getEntries(userPrincipal.getId(), id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
