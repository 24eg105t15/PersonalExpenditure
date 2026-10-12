package com.spendwise.repository;

import com.spendwise.entity.SavingsEntryType;
import com.spendwise.entity.SavingsGoalEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface SavingsGoalEntryRepository extends JpaRepository<SavingsGoalEntry, Long> {

    List<SavingsGoalEntry> findBySavingsGoalIdAndUserIdOrderByEntryDateDescCreatedAtDesc(Long savingsGoalId, Long userId);

    @Query("SELECT COALESCE(SUM(e.amount), 0.00) FROM SavingsGoalEntry e WHERE e.savingsGoal.id = :goalId AND e.type = :type")
    BigDecimal sumAmountBySavingsGoalIdAndType(@Param("goalId") Long goalId, @Param("type") SavingsEntryType type);
}
