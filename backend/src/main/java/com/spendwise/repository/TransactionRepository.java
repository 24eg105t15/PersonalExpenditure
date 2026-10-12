package com.spendwise.repository;

import com.spendwise.entity.Transaction;
import com.spendwise.entity.TransactionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long>, JpaSpecificationExecutor<Transaction> {

    Optional<Transaction> findByIdAndUserId(Long id, Long userId);

    List<Transaction> findTop5ByUserIdOrderByTransactionDateDescCreatedAtDesc(Long userId);

    List<Transaction> findTop10ByUserIdOrderByTransactionDateDescCreatedAtDesc(Long userId);

    @Query("SELECT COALESCE(SUM(t.amount), 0.00) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumAmountByUserIdAndTypeAndDateBetween(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT COALESCE(SUM(t.amount), 0.00) FROM Transaction t WHERE t.user.id = :userId AND t.type = :type")
    BigDecimal sumAmountByUserIdAndType(
            @Param("userId") Long userId,
            @Param("type") TransactionType type);

    @Query("SELECT COALESCE(SUM(t.amount), 0.00) FROM Transaction t WHERE t.user.id = :userId AND t.category.id = :categoryId AND t.type = 'EXPENSE' AND t.transactionDate BETWEEN :startDate AND :endDate")
    BigDecimal sumExpenseByUserIdAndCategoryAndDateBetween(
            @Param("userId") Long userId,
            @Param("categoryId") Long categoryId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT t.category.id AS categoryId, t.category.name AS categoryName, t.category.color AS color, t.category.icon AS icon, COALESCE(SUM(t.amount), 0.00) AS totalAmount, COUNT(t) AS transactionCount " +
           "FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = :type AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.category.id, t.category.name, t.category.color, t.category.icon " +
           "ORDER BY totalAmount DESC")
    List<Object[]> findCategoryBreakdown(
            @Param("userId") Long userId,
            @Param("type") TransactionType type,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT YEAR(t.transactionDate) AS yr, MONTH(t.transactionDate) AS mo, t.type AS txType, COALESCE(SUM(t.amount), 0.00) AS totalAmt " +
           "FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY YEAR(t.transactionDate), MONTH(t.transactionDate), t.type " +
           "ORDER BY yr ASC, mo ASC")
    List<Object[]> findMonthlyCashFlow(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    @Query("SELECT t.transactionDate, COALESCE(SUM(t.amount), 0.00) " +
           "FROM Transaction t " +
           "WHERE t.user.id = :userId AND t.type = 'EXPENSE' AND t.transactionDate BETWEEN :startDate AND :endDate " +
           "GROUP BY t.transactionDate " +
           "ORDER BY t.transactionDate ASC")
    List<Object[]> findDailyExpenseTrend(
            @Param("userId") Long userId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate);

    boolean existsByCategoryId(Long categoryId);
}
