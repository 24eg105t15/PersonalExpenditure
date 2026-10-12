package com.spendwise.service;

import com.spendwise.dto.auth.UserResponse;
import com.spendwise.dto.profile.ChangePasswordRequest;
import com.spendwise.dto.profile.ProfileUpdateRequest;
import com.spendwise.dto.profile.SettingsRequest;
import com.spendwise.dto.profile.SettingsResponse;
import com.spendwise.entity.User;
import com.spendwise.entity.UserSettings;
import com.spendwise.exception.BadRequestException;
import com.spendwise.exception.DuplicateResourceException;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.UserRepository;
import com.spendwise.repository.UserSettingsRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final PasswordEncoder passwordEncoder;

    public UserProfileService(UserRepository userRepository,
                              UserSettingsRepository userSettingsRepository,
                              PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public UserResponse getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.isEnabled(), user.getCreatedAt());
    }

    @Transactional
    public UserResponse updateProfile(Long userId, ProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String newEmail = request.getEmail().trim().toLowerCase();
        if (!user.getEmail().equalsIgnoreCase(newEmail)) {
            if (userRepository.existsByEmail(newEmail)) {
                throw new DuplicateResourceException("Email " + newEmail + " is already in use by another account");
            }
            user.setEmail(newEmail);
        }

        user.setFullName(request.getFullName().trim());
        User updated = userRepository.save(user);

        return new UserResponse(updated.getId(), updated.getFullName(), updated.getEmail(), updated.isEnabled(), updated.getCreatedAt());
    }

    @Transactional
    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("New password cannot be the same as old password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public SettingsResponse getSettings(Long userId) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    UserSettings created = new UserSettings(user);
                    return userSettingsRepository.save(created);
                });

        return new SettingsResponse(
                settings.getId(),
                settings.getCurrency(),
                settings.getDateFormat(),
                settings.getTheme(),
                settings.isMonthlyBudgetAlert()
        );
    }

    @Transactional
    public SettingsResponse updateSettings(Long userId, SettingsRequest request) {
        UserSettings settings = userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
                    UserSettings created = new UserSettings(user);
                    return userSettingsRepository.save(created);
                });

        settings.setCurrency(request.getCurrency().trim().toUpperCase());
        settings.setDateFormat(request.getDateFormat().trim());
        settings.setTheme(request.getTheme().trim().toLowerCase());
        settings.setMonthlyBudgetAlert(request.isMonthlyBudgetAlert());

        UserSettings updated = userSettingsRepository.save(settings);
        return new SettingsResponse(
                updated.getId(),
                updated.getCurrency(),
                updated.getDateFormat(),
                updated.getTheme(),
                updated.isMonthlyBudgetAlert()
        );
    }
}
