package com.spendwise.service;

import com.spendwise.entity.*;
import com.spendwise.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class DataSeedService implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataSeedService.class);

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final CategoryRepository categoryRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final SavingsGoalRepository savingsGoalRepository;
    private final SavingsGoalEntryRepository savingsGoalEntryRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.seed.demo-data:true}")
    private boolean seedDemoData;

    public DataSeedService(UserRepository userRepository,
                           UserSettingsRepository userSettingsRepository,
                           CategoryRepository categoryRepository,
                           TransactionRepository transactionRepository,
                           BudgetRepository budgetRepository,
                           SavingsGoalRepository savingsGoalRepository,
                           SavingsGoalEntryRepository savingsGoalEntryRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.categoryRepository = categoryRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.savingsGoalRepository = savingsGoalRepository;
        this.savingsGoalEntryRepository = savingsGoalEntryRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (!seedDemoData) {
            log.info("Demo data seeding is disabled.");
            return;
        }

        String demoEmail = "demo@spendwise.com";
        if (userRepository.existsByEmail(demoEmail)) {
            log.info("Demo user {} already exists. Skipping seed.", demoEmail);
            return;
        }

        log.info("Seeding realistic demo user and financial data...");

        // 1. Create Demo User
        User demoUser = new User();
        demoUser.setFullName("Alex Johnson");
        demoUser.setEmail(demoEmail);
        demoUser.setPasswordHash(passwordEncoder.encode("Demo@123"));
        demoUser.setEnabled(true);
        demoUser = userRepository.save(demoUser);

        UserSettings settings = new UserSettings(demoUser);
        settings.setCurrency("INR");
        settings.setDateFormat("DD/MM/YYYY");
        settings.setTheme("light");
        userSettingsRepository.save(settings);

        // Fetch categories
        List<Category> allCategories = categoryRepository.findAllAvailableForUser(demoUser.getId());
        Category salaryCat = findCat(allCategories, "Salary");
        Category freelanceCat = findCat(allCategories, "Freelance");
        Category investmentCat = findCat(allCategories, "Investment Income");
        Category rentCat = findCat(allCategories, "Rent and Housing");
        Category groceriesCat = findCat(allCategories, "Groceries");
        Category diningCat = findCat(allCategories, "Food and Dining");
        Category utilitiesCat = findCat(allCategories, "Utilities");
        Category transportCat = findCat(allCategories, "Transportation");
        Category shoppingCat = findCat(allCategories, "Shopping");
        Category subsCat = findCat(allCategories, "Subscriptions");
        Category entertainmentCat = findCat(allCategories, "Entertainment");
        Category healthcareCat = findCat(allCategories, "Healthcare");

        LocalDate today = LocalDate.now();

        // 2. Seed past 4 months of realistic transactions
        for (int m = 3; m >= 0; m--) {
            LocalDate monthBase = today.minusMonths(m);
            int year = monthBase.getYear();
            int month = monthBase.getMonthValue();

            // Monthly Incomes
            createTx(demoUser, salaryCat, TransactionType.INCOME, new BigDecimal("85000.00"), "Monthly Salary - Tech Corp", LocalDate.of(year, month, 1), "Bank Transfer", "Direct bank deposit");
            if (m % 2 == 0) {
                createTx(demoUser, freelanceCat, TransactionType.INCOME, new BigDecimal("18500.00"), "Freelance UI Design Project", LocalDate.of(year, month, 15), "UPI", "Client milestone payment");
            }
            if (m == 1 || m == 3) {
                createTx(demoUser, investmentCat, TransactionType.INCOME, new BigDecimal("4200.00"), "Mutual Fund Dividend", LocalDate.of(year, month, 20), "Bank Transfer", "Quarterly distribution");
            }

            // Monthly Fixed Expenses
            createTx(demoUser, rentCat, TransactionType.EXPENSE, new BigDecimal("25000.00"), "Apartment Rent", LocalDate.of(year, month, 2), "Bank Transfer", "Monthly rent paid to landlord");
            createTx(demoUser, utilitiesCat, TransactionType.EXPENSE, new BigDecimal("3200.00"), "Electricity & Water Bill", LocalDate.of(year, month, 5), "UPI", "BESCOM electricity bill");
            createTx(demoUser, utilitiesCat, TransactionType.EXPENSE, new BigDecimal("1199.00"), "High Speed Fiber Internet", LocalDate.of(year, month, 7), "Credit Card", "Airtel broadband");
            createTx(demoUser, subsCat, TransactionType.EXPENSE, new BigDecimal("649.00"), "Netflix & Spotify Subscription", LocalDate.of(year, month, 8), "Credit Card", "Digital entertainment subscriptions");

            // Variable Expenses
            createTx(demoUser, groceriesCat, TransactionType.EXPENSE, new BigDecimal("4500.00"), "Supermarket Groceries", LocalDate.of(year, month, 6), "UPI", "Weekly fruits, vegetables and staples");
            createTx(demoUser, groceriesCat, TransactionType.EXPENSE, new BigDecimal("3800.00"), "Nature Basket Organic Groceries", LocalDate.of(year, month, 14), "Debit Card", "Specialty groceries");
            createTx(demoUser, groceriesCat, TransactionType.EXPENSE, new BigDecimal("4200.00"), "DMart Monthly Staples", LocalDate.of(year, month, 22), "UPI", "Household supplies");

            createTx(demoUser, diningCat, TransactionType.EXPENSE, new BigDecimal("1450.00"), "Dinner with Friends", LocalDate.of(year, month, 10), "UPI", "Italian Bistro dinner");
            createTx(demoUser, diningCat, TransactionType.EXPENSE, new BigDecimal("680.00"), "Weekend Cafe & Coffee", LocalDate.of(year, month, 18), "UPI", "Third Wave Coffee");
            createTx(demoUser, diningCat, TransactionType.EXPENSE, new BigDecimal("1250.00"), "Zomato Weekend Delivery", LocalDate.of(year, month, 25), "Credit Card", "Biryani ordering");

            createTx(demoUser, transportCat, TransactionType.EXPENSE, new BigDecimal("2500.00"), "Fuel for Car", LocalDate.of(year, month, 9), "Credit Card", "HP Petrol bunk");
            createTx(demoUser, transportCat, TransactionType.EXPENSE, new BigDecimal("850.00"), "Uber City Cab", LocalDate.of(year, month, 17), "UPI", "Airport commute");

            if (m == 0 || m == 2) {
                createTx(demoUser, shoppingCat, TransactionType.EXPENSE, new BigDecimal("4890.00"), "Clothing & Footwear", LocalDate.of(year, month, 12), "Credit Card", "Myntra shopping");
            }
            if (m == 1) {
                createTx(demoUser, entertainmentCat, TransactionType.EXPENSE, new BigDecimal("1200.00"), "Movie Tickets & Snacks", LocalDate.of(year, month, 16), "UPI", "PVR Cinemas IMAX");
            }
            if (m == 0) {
                createTx(demoUser, healthcareCat, TransactionType.EXPENSE, new BigDecimal("1500.00"), "Health Checkup & Vitamins", LocalDate.of(year, month, 11), "UPI", "Apollo Pharmacy");
            }

            // 3. Budgets for this month
            if (rentCat != null) createBudget(demoUser, rentCat, new BigDecimal("25000.00"), month, year, 90);
            if (groceriesCat != null) createBudget(demoUser, groceriesCat, new BigDecimal("15000.00"), month, year, 80);
            if (diningCat != null) createBudget(demoUser, diningCat, new BigDecimal("5000.00"), month, year, 75);
            if (utilitiesCat != null) createBudget(demoUser, utilitiesCat, new BigDecimal("6000.00"), month, year, 85);
            if (transportCat != null) createBudget(demoUser, transportCat, new BigDecimal("5000.00"), month, year, 80);
            if (shoppingCat != null) createBudget(demoUser, shoppingCat, new BigDecimal("8000.00"), month, year, 80);
        }

        // 4. Savings Goals
        createSavingsGoalWithEntries(demoUser, "Emergency Fund", "6 months of essential living expenses",
                new BigDecimal("200000.00"), new BigDecimal("145000.00"), today.plusMonths(8),
                List.of(
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("50000.00"), "Initial savings deposit", today.minusMonths(3)),
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("35000.00"), "Quarterly bonus allocation", today.minusMonths(2)),
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("30000.00"), "Monthly planned contribution", today.minusMonths(1)),
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("30000.00"), "Monthly contribution", today)
                ));

        createSavingsGoalWithEntries(demoUser, "Japan Vacation", "Spring cherry blossom trip fund",
                new BigDecimal("150000.00"), new BigDecimal("95000.00"), today.plusMonths(5),
                List.of(
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("40000.00"), "Trip savings start", today.minusMonths(3)),
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("30000.00"), "Freelance project savings", today.minusMonths(2)),
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("25000.00"), "Monthly flight fund deposit", today.minusMonths(1))
                ));

        createSavingsGoalWithEntries(demoUser, "MacBook Pro M3", "Next-gen development workstation",
                new BigDecimal("180000.00"), new BigDecimal("180000.00"), today.minusDays(5),
                List.of(
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("60000.00"), "Deposit 1", today.minusMonths(3)),
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("60000.00"), "Deposit 2", today.minusMonths(2)),
                        new EntryData(SavingsEntryType.CONTRIBUTION, new BigDecimal("60000.00"), "Deposit 3 - Goal Reached!", today.minusMonths(1))
                ));

        log.info("Demo user successfully created: Email='{}', Password='{}'", demoEmail, "Demo@123");
    }

    private Category findCat(List<Category> list, String name) {
        return list.stream()
                .filter(c -> c.getName().equalsIgnoreCase(name))
                .findFirst()
                .orElse(null);
    }

    private void createTx(User user, Category cat, TransactionType type, BigDecimal amt, String desc, LocalDate date, String method, String notes) {
        if (cat == null) return;
        Transaction tx = new Transaction(user, cat, type, amt, desc, date, method, notes);
        transactionRepository.save(tx);
    }

    private void createBudget(User user, Category cat, BigDecimal amt, int month, int year, int threshold) {
        if (cat == null) return;
        if (!budgetRepository.existsByUserIdAndCategoryIdAndMonthAndYear(user.getId(), cat.getId(), month, year)) {
            Budget b = new Budget(user, cat, amt, month, year, threshold);
            budgetRepository.save(b);
        }
    }

    private record EntryData(SavingsEntryType type, BigDecimal amount, String notes, LocalDate date) {}

    private void createSavingsGoalWithEntries(User user, String name, String desc, BigDecimal target, BigDecimal current, LocalDate targetDate, List<EntryData> entries) {
        SavingsGoalStatus status = current.compareTo(target) >= 0 ? SavingsGoalStatus.COMPLETED : SavingsGoalStatus.IN_PROGRESS;
        SavingsGoal goal = new SavingsGoal(user, name, desc, target, current, targetDate, status);
        SavingsGoal savedGoal = savingsGoalRepository.save(goal);

        for (EntryData ed : entries) {
            SavingsGoalEntry entry = new SavingsGoalEntry(savedGoal, user, ed.type, ed.amount, ed.notes, ed.date);
            savingsGoalEntryRepository.save(entry);
        }
    }
}
