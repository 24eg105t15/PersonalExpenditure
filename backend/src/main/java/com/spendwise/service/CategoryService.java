package com.spendwise.service;

import com.spendwise.dto.category.CategoryRequest;
import com.spendwise.dto.category.CategoryResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.TransactionType;
import com.spendwise.entity.User;
import com.spendwise.exception.BadRequestException;
import com.spendwise.exception.ForbiddenException;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.TransactionRepository;
import com.spendwise.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final TransactionRepository transactionRepository;

    public CategoryService(CategoryRepository categoryRepository,
                           UserRepository userRepository,
                           TransactionRepository transactionRepository) {
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
        this.transactionRepository = transactionRepository;
    }

    @Transactional(readOnly = true)
    public List<CategoryResponse> getCategories(Long userId, TransactionType type) {
        List<Category> categories;
        if (type != null) {
            categories = categoryRepository.findAvailableForUserAndType(userId, type);
        } else {
            categories = categoryRepository.findAllAvailableForUser(userId);
        }
        return categories.stream().map(this::mapToResponse).toList();
    }

    @Transactional
    public CategoryResponse createCategory(Long userId, CategoryRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        String name = request.getName().trim();
        if (categoryRepository.existsByUserIdAndNameIgnoreCase(userId, name) ||
            categoryRepository.existsByNameIgnoreCaseAndUserIsNull(name)) {
            throw new BadRequestException("Category with name '" + name + "' already exists");
        }

        String color = request.getColor() != null && !request.getColor().isBlank() ? request.getColor() : "#6366F1";
        Category category = new Category(user, name, request.getType(), request.getIcon(), color, false);
        Category saved = categoryRepository.save(category);
        return mapToResponse(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(Long userId, Long categoryId, CategoryRequest request) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (category.isDefault() || category.getUser() == null) {
            throw new ForbiddenException("System default categories cannot be modified");
        }

        if (!category.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to modify this category");
        }

        category.setName(request.getName().trim());
        category.setType(request.getType());
        category.setIcon(request.getIcon());
        if (request.getColor() != null && !request.getColor().isBlank()) {
            category.setColor(request.getColor());
        }

        Category updated = categoryRepository.save(category);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteCategory(Long userId, Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (category.isDefault() || category.getUser() == null) {
            throw new ForbiddenException("System default categories cannot be deleted");
        }

        if (!category.getUser().getId().equals(userId)) {
            throw new ForbiddenException("You are not authorized to delete this category");
        }

        if (transactionRepository.existsByCategoryId(categoryId)) {
            throw new BadRequestException("Cannot delete category because it is linked to existing transactions. Reassign or delete those transactions first.");
        }

        categoryRepository.delete(category);
    }

    public Category getCategoryOrThrow(Long categoryId, Long userId) {
        return categoryRepository.findAvailableByIdAndUser(categoryId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found or not accessible"));
    }

    private CategoryResponse mapToResponse(Category category) {
        boolean isCustom = category.getUser() != null;
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getType(),
                category.getIcon(),
                category.getColor(),
                category.isDefault(),
                isCustom,
                category.getCreatedAt()
        );
    }
}
