package com.spendwise.repository;

import com.spendwise.entity.Category;
import com.spendwise.entity.TransactionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Query("SELECT c FROM Category c WHERE c.user.id = :userId OR c.user IS NULL ORDER BY c.name ASC")
    List<Category> findAllAvailableForUser(@Param("userId") Long userId);

    @Query("SELECT c FROM Category c WHERE (c.user.id = :userId OR c.user IS NULL) AND c.type = :type ORDER BY c.name ASC")
    List<Category> findAvailableForUserAndType(@Param("userId") Long userId, @Param("type") TransactionType type);

    @Query("SELECT c FROM Category c WHERE c.id = :id AND (c.user.id = :userId OR c.user IS NULL)")
    Optional<Category> findAvailableByIdAndUser(@Param("id") Long id, @Param("userId") Long userId);

    Optional<Category> findByIdAndUserId(Long id, Long userId);

    boolean existsByUserIdAndNameIgnoreCase(Long userId, String name);
    
    boolean existsByNameIgnoreCaseAndUserIsNull(String name);
}
