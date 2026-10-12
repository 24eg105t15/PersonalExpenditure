package com.spendwise.controller;

import com.spendwise.dto.common.ApiResponse;
import com.spendwise.dto.dashboard.CashFlowResponse;
import com.spendwise.dto.report.MonthlyReportResponse;
import com.spendwise.security.UserPrincipal;
import com.spendwise.service.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/monthly")
    public ResponseEntity<ApiResponse<MonthlyReportResponse>> getMonthlyReport(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {

        int m = month != null ? month : LocalDate.now().getMonthValue();
        int y = year != null ? year : LocalDate.now().getYear();

        MonthlyReportResponse response = reportService.getMonthlyReport(userPrincipal.getId(), m, y);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/cash-flow")
    public ResponseEntity<ApiResponse<List<CashFlowResponse>>> getCashFlowReport(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam(required = false) Integer year) {

        int y = year != null ? year : LocalDate.now().getYear();
        List<CashFlowResponse> response = reportService.getAnnualCashFlowReport(userPrincipal.getId(), y);
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}
