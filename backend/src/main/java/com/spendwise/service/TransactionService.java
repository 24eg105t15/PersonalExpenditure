package com.spendwise.service;

import com.spendwise.dto.common.PagedResponse;
import com.spendwise.dto.transaction.TransactionRequest;
import com.spendwise.dto.transaction.TransactionResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.Transaction;
import com.spendwise.entity.TransactionType;
import com.spendwise.entity.User;
import com.spendwise.exception.BadRequestException;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.repository.TransactionRepository;
import com.spendwise.repository.UserRepository;
import jakarta.persistence.criteria.Predicate;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.io.Writer;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;

    public TransactionService(TransactionRepository transactionRepository,
                              CategoryRepository categoryRepository,
                              UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.categoryRepository = categoryRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public TransactionResponse createTransaction(Long userId, TransactionRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Category category = categoryRepository.findAvailableByIdAndUser(request.getCategoryId(), userId)
                .orElseThrow(() -> new BadRequestException("Category not found or not accessible"));

        if (category.getType() != request.getType()) {
            throw new BadRequestException("Category type (" + category.getType() + ") does not match transaction type (" + request.getType() + ")");
        }

        BigDecimal scaledAmount = request.getAmount().setScale(2, RoundingMode.HALF_UP);

        Transaction transaction = new Transaction(
                user,
                category,
                request.getType(),
                scaledAmount,
                request.getDescription().trim(),
                request.getTransactionDate(),
                request.getPaymentMethod().trim(),
                request.getNotes() != null ? request.getNotes().trim() : null
        );

        Transaction saved = transactionRepository.save(transaction);
        return mapToResponse(saved);
    }

    @Transactional(readOnly = true)
    public TransactionResponse getTransaction(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        return mapToResponse(transaction);
    }

    @Transactional
    public TransactionResponse updateTransaction(Long userId, Long transactionId, TransactionRequest request) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));

        Category category = categoryRepository.findAvailableByIdAndUser(request.getCategoryId(), userId)
                .orElseThrow(() -> new BadRequestException("Category not found or not accessible"));

        if (category.getType() != request.getType()) {
            throw new BadRequestException("Category type (" + category.getType() + ") does not match transaction type (" + request.getType() + ")");
        }

        BigDecimal scaledAmount = request.getAmount().setScale(2, RoundingMode.HALF_UP);

        transaction.setCategory(category);
        transaction.setType(request.getType());
        transaction.setAmount(scaledAmount);
        transaction.setDescription(request.getDescription().trim());
        transaction.setTransactionDate(request.getTransactionDate());
        transaction.setPaymentMethod(request.getPaymentMethod().trim());
        transaction.setNotes(request.getNotes() != null ? request.getNotes().trim() : null);

        Transaction updated = transactionRepository.save(transaction);
        return mapToResponse(updated);
    }

    @Transactional
    public void deleteTransaction(Long userId, Long transactionId) {
        Transaction transaction = transactionRepository.findByIdAndUserId(transactionId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found"));
        transactionRepository.delete(transaction);
    }

    @Transactional(readOnly = true)
    public PagedResponse<TransactionResponse> getTransactions(Long userId,
                                                              TransactionType type,
                                                              Long categoryId,
                                                              String paymentMethod,
                                                              LocalDate startDate,
                                                              LocalDate endDate,
                                                              String search,
                                                              int page,
                                                              int size,
                                                              String sortBy,
                                                              String sortDir) {
        Sort sort = Sort.by(Sort.Direction.fromString(sortDir.equalsIgnoreCase("asc") ? "asc" : "desc"),
                (sortBy != null && !sortBy.isBlank()) ? sortBy : "transactionDate")
                .and(Sort.by(Sort.Direction.DESC, "id"));

        Pageable pageable = PageRequest.of(Math.max(0, page), Math.max(1, size), sort);

        Specification<Transaction> spec = buildSpecification(userId, type, categoryId, paymentMethod, startDate, endDate, search);
        Page<Transaction> pageResult = transactionRepository.findAll(spec, pageable);

        List<TransactionResponse> content = pageResult.getContent().stream()
                .map(this::mapToResponse)
                .toList();

        return new PagedResponse<>(
                content,
                pageResult.getNumber(),
                pageResult.getSize(),
                pageResult.getTotalElements(),
                pageResult.getTotalPages(),
                pageResult.isLast()
        );
    }

    @Transactional(readOnly = true)
    public void exportTransactionsToCsv(Long userId,
                                       TransactionType type,
                                       Long categoryId,
                                       String paymentMethod,
                                       LocalDate startDate,
                                       LocalDate endDate,
                                       String search,
                                       Writer writer) throws IOException {
        Specification<Transaction> spec = buildSpecification(userId, type, categoryId, paymentMethod, startDate, endDate, search);
        Sort sort = Sort.by(Sort.Direction.DESC, "transactionDate").and(Sort.by(Sort.Direction.DESC, "id"));
        List<Transaction> transactions = transactionRepository.findAll(spec, sort);

        String[] headers = {"Date", "Type", "Category", "Description", "Amount (INR)", "Payment Method", "Notes"};
        CSVFormat csvFormat = CSVFormat.DEFAULT.builder().setHeader(headers).build();

        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        try (CSVPrinter printer = new CSVPrinter(writer, csvFormat)) {
            for (Transaction tx : transactions) {
                printer.printRecord(
                        tx.getTransactionDate().format(dtf),
                        tx.getType().name(),
                        sanitizeCsv(tx.getCategory().getName()),
                        sanitizeCsv(tx.getDescription()),
                        tx.getAmount().setScale(2, RoundingMode.HALF_UP).toString(),
                        sanitizeCsv(tx.getPaymentMethod()),
                        sanitizeCsv(tx.getNotes() != null ? tx.getNotes() : "")
                );
            }
        }
    }

    private String sanitizeCsv(String value) {
        if (value == null) return "";
        // Prevent CSV Formula Injection
        if (value.startsWith("=") || value.startsWith("+") || value.startsWith("-") || value.startsWith("@")) {
            return "'" + value;
        }
        return value;
    }

    private Specification<Transaction> buildSpecification(Long userId,
                                                           TransactionType type,
                                                           Long categoryId,
                                                           String paymentMethod,
                                                           LocalDate startDate,
                                                           LocalDate endDate,
                                                           String search) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            predicates.add(cb.equal(root.get("user").get("id"), userId));

            if (type != null) {
                predicates.add(cb.equal(root.get("type"), type));
            }
            if (categoryId != null) {
                predicates.add(cb.equal(root.get("category").get("id"), categoryId));
            }
            if (paymentMethod != null && !paymentMethod.isBlank()) {
                predicates.add(cb.equal(root.get("paymentMethod"), paymentMethod.trim()));
            }
            if (startDate != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("transactionDate"), startDate));
            }
            if (endDate != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("transactionDate"), endDate));
            }
            if (search != null && !search.isBlank()) {
                String searchPattern = "%" + search.trim().toLowerCase() + "%";
                Predicate descPredicate = cb.like(cb.lower(root.get("description")), searchPattern);
                Predicate notesPredicate = cb.like(cb.lower(root.get("notes")), searchPattern);
                predicates.add(cb.or(descPredicate, notesPredicate));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }

    public TransactionResponse mapToResponse(Transaction t) {
        return new TransactionResponse(
                t.getId(),
                t.getType(),
                t.getAmount(),
                t.getDescription(),
                t.getCategory().getId(),
                t.getCategory().getName(),
                t.getCategory().getIcon(),
                t.getCategory().getColor(),
                t.getTransactionDate(),
                t.getPaymentMethod(),
                t.getNotes(),
                t.getCreatedAt(),
                t.getUpdatedAt()
        );
    }
}
