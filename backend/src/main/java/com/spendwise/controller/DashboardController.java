package com.spendwise.controller;

import com.spendwise.dto.common.ApiResponse;
import com.spendwise.dto.dashboard.CashFlowResponse;
import com.spendwise.dto.dashboard.CategoryBreakdownResponse;
import com.spendwise.dto.dashboard.DashboardSummaryResponse;
import com.spendwise.dto.transaction.TransactionResponse;
import com.spendwise.entity.TransactionType;
import com.spendwise.security.UserPrincipal;
import com.spendwise.service.DashboardService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<DashboardSummaryResponse>> getSummary(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "current_month") String period,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        DashboardSummaryResponse response = dashboardService.getSummary(userPrincipal.getId(), period, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/cash-flow")
    public ResponseEntity<ApiResponse<List<CashFlowResponse>>> getCashFlow(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "6") int months) {

        List<CashFlowResponse> response = dashboardService.getCashFlow(userPrincipal.getId(), months);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/category-breakdown")
    public ResponseEntity<ApiResponse<List<CategoryBreakdownResponse>>> getCategoryBreakdown(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(defaultValue = "EXPENSE") TransactionType type,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<CategoryBreakdownResponse> response = dashboardService.getCategoryBreakdown(userPrincipal.getId(), type, startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/recent-transactions")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getRecentTransactions(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        List<TransactionResponse> response = dashboardService.getRecentTransactions(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
