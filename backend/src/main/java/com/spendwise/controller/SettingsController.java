package com.spendwise.controller;

import com.spendwise.dto.common.ApiResponse;
import com.spendwise.dto.profile.SettingsRequest;
import com.spendwise.dto.profile.SettingsResponse;
import com.spendwise.security.UserPrincipal;
import com.spendwise.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final UserProfileService userProfileService;

    public SettingsController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<SettingsResponse>> getSettings(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        SettingsResponse response = userProfileService.getSettings(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @PutMapping
    public ResponseEntity<ApiResponse<SettingsResponse>> updateSettings(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody SettingsRequest request) {
        SettingsResponse response = userProfileService.updateSettings(userPrincipal.getId(), request);
        return ResponseEntity.ok(ApiResponse.success("Settings updated successfully", response));
    }
}
