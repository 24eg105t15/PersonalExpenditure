package com.spendwise.service;

import com.spendwise.dto.savings.SavingsGoalEntryRequest;
import com.spendwise.dto.savings.SavingsGoalEntryResponse;
import com.spendwise.dto.savings.SavingsGoalRequest;
import com.spendwise.dto.savings.SavingsGoalResponse;
import com.spendwise.entity.SavingsEntryType;
import com.spendwise.entity.SavingsGoal;
import com.spendwise.entity.SavingsGoalEntry;
import com.spendwise.entity.SavingsGoalStatus;
import com.spendwise.entity.User;
import com.spendwise.exception.BadRequestException;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.SavingsGoalEntryRepository;
import com.spendwise.repository.SavingsGoalRepository;
import com.spendwise.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
public class SavingsGoalService {

    private final SavingsGoalRepository savingsGoalRepository;
    private final SavingsGoalEntryRepository savingsGoalEntryRepository;
    private final UserRepository userRepository;

    public SavingsGoalService(SavingsGoalRepository savingsGoalRepository,
                              SavingsGoalEntryRepository savingsGoalEntryRepository,
                              UserRepository userRepository) {
        this.savingsGoalRepository = savingsGoalRepository;
        this.savingsGoalEntryRepository = savingsGoalEntryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SavingsGoalResponse createGoal(Long userId, SavingsGoalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        BigDecimal targetAmount = request.getTargetAmount().setScale(2, RoundingMode.HALF_UP);
        BigDecimal initialAmount = request.getInitialAmount() != null
                ? request.getInitialAmount().setScale(2, RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        SavingsGoalStatus status = initialAmount.compareTo(targetAmount) >= 0
                ? SavingsGoalStatus.COMPLETED
                : SavingsGoalStatus.IN_PROGRESS;

        SavingsGoal goal = new SavingsGoal(
                user,
                request.getName().trim(),
                request.getDescription() != null ? request.getDescription().trim() : null,
                targetAmount,
                initialAmount,
                request.getTargetDate(),
                status
        );

        SavingsGoal savedGoal = savingsGoalRepository.save(goal);

        if (initialAmount.compareTo(BigDecimal.ZERO) > 0) {
            SavingsGoalEntry entry = new SavingsGoalEntry(
                    savedGoal,
                    user,
                    SavingsEntryType.CONTRIBUTION,
                    initialAmount,
                    "Initial deposit",
                    LocalDate.now()
            );
            savingsGoalEntryRepository.save(entry);
        }

        return mapToResponse(savedGoal);
    }

    @Transactional(readOnly = true)
    public List<SavingsGoalResponse> getGoals(Long userId) {
        return savingsGoalRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public SavingsGoalResponse getGoal(Long userId, Long goalId) {
        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found"));
        return mapToResponse(goal);
    }

    @Transactional
    public SavingsGoalResponse updateGoal(Long userId, Long goalId, SavingsGoalRequest request) {
        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found"));

        goal.setName(request.getName().trim());
        goal.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        goal.setTargetAmount(request.getTargetAmount().setScale(2, RoundingMode.HALF_UP));
        goal.setTargetDate(request.getTargetDate());

        if (goal.getCurrentAmount().compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(SavingsGoalStatus.COMPLETED);
        } else if (goal.getStatus() == SavingsGoalStatus.COMPLETED) {
            goal.setStatus(SavingsGoalStatus.IN_PROGRESS);
        }

        SavingsGoal updated = savingsGoalRepository.save(goal);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteGoal(Long userId, Long goalId) {
        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found"));
        savingsGoalRepository.delete(goal);
    }

    @Transactional
    public SavingsGoalResponse addEntry(Long userId, Long goalId, SavingsGoalEntryRequest request) {
        SavingsGoal goal = savingsGoalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found"));

        User user = goal.getUser();
        BigDecimal entryAmount = request.getAmount().setScale(2, RoundingMode.HALF_UP);

        BigDecimal currentAmount = goal.getCurrentAmount();
        if (request.getType() == SavingsEntryType.CONTRIBUTION) {
            currentAmount = currentAmount.add(entryAmount);
        } else if (request.getType() == SavingsEntryType.WITHDRAWAL) {
            if (currentAmount.compareTo(entryAmount) < 0) {
                throw new BadRequestException("Cannot withdraw " + entryAmount + ". Current saved balance is " + currentAmount);
            }
            currentAmount = currentAmount.subtract(entryAmount);
        }

        goal.setCurrentAmount(currentAmount);
        if (currentAmount.compareTo(goal.getTargetAmount()) >= 0) {
            goal.setStatus(SavingsGoalStatus.COMPLETED);
        } else {
            goal.setStatus(SavingsGoalStatus.IN_PROGRESS);
        }

        SavingsGoalEntry entry = new SavingsGoalEntry(
                goal,
                user,
                request.getType(),
                entryAmount,
                request.getNotes() != null ? request.getNotes().trim() : null,
                request.getEntryDate()
        );

        savingsGoalEntryRepository.save(entry);
        SavingsGoal updatedGoal = savingsGoalRepository.save(goal);

        return mapToResponse(updatedGoal);
    }

    @Transactional(readOnly = true)
    public List<SavingsGoalEntryResponse> getEntries(Long userId, Long goalId) {
        // verify ownership
        savingsGoalRepository.findByIdAndUserId(goalId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Savings goal not found"));

        return savingsGoalEntryRepository.findBySavingsGoalIdAndUserIdOrderByEntryDateDescCreatedAtDesc(goalId, userId).stream()
                .map(this::mapToEntryResponse)
                .toList();
    }

    private SavingsGoalResponse mapToResponse(SavingsGoal goal) {
        BigDecimal remaining = goal.getTargetAmount().subtract(goal.getCurrentAmount());
        if (remaining.compareTo(BigDecimal.ZERO) < 0) {
            remaining = BigDecimal.ZERO;
        }

        double progress = 0.0;
        if (goal.getTargetAmount().compareTo(BigDecimal.ZERO) > 0) {
            progress = goal.getCurrentAmount().multiply(BigDecimal.valueOf(100))
                    .divide(goal.getTargetAmount(), 1, RoundingMode.HALF_UP)
                    .doubleValue();
        }

        return new SavingsGoalResponse(
                goal.getId(),
                goal.getName(),
                goal.getDescription(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                remaining,
                progress,
                goal.getTargetDate(),
                goal.getStatus(),
                goal.getCreatedAt()
        );
    }

    private SavingsGoalEntryResponse mapToEntryResponse(SavingsGoalEntry entry) {
        return new SavingsGoalEntryResponse(
                entry.getId(),
                entry.getSavingsGoal().getId(),
                entry.getType(),
                entry.getAmount(),
                entry.getNotes(),
                entry.getEntryDate(),
                entry.getCreatedAt()
        );
    }
}
