-- Flyway Migration V2: System Default Categories

-- Expense categories (user_id is NULL for system-wide defaults)
INSERT INTO categories (user_id, name, type, icon, color, is_default) VALUES
(NULL, 'Food and Dining', 'EXPENSE', 'Utensils', '#F97316', TRUE),
(NULL, 'Groceries', 'EXPENSE', 'ShoppingCart', '#10B981', TRUE),
(NULL, 'Transportation', 'EXPENSE', 'Car', '#3B82F6', TRUE),
(NULL, 'Shopping', 'EXPENSE', 'ShoppingBag', '#EC4899', TRUE),
(NULL, 'Rent and Housing', 'EXPENSE', 'Home', '#8B5CF6', TRUE),
(NULL, 'Utilities', 'EXPENSE', 'Zap', '#EAB308', TRUE),
(NULL, 'Healthcare', 'EXPENSE', 'HeartPulse', '#EF4444', TRUE),
(NULL, 'Education', 'EXPENSE', 'GraduationCap', '#6366F1', TRUE),
(NULL, 'Entertainment', 'EXPENSE', 'Film', '#A855F7', TRUE),
(NULL, 'Travel', 'EXPENSE', 'Plane', '#06B6D4', TRUE),
(NULL, 'Personal Care', 'EXPENSE', 'Sparkles', '#F43F5E', TRUE),
(NULL, 'Subscriptions', 'EXPENSE', 'Repeat', '#14B8A6', TRUE),
(NULL, 'Other Expense', 'EXPENSE', 'HelpCircle', '#64748B', TRUE);

-- Income categories
INSERT INTO categories (user_id, name, type, icon, color, is_default) VALUES
(NULL, 'Salary', 'INCOME', 'Briefcase', '#10B981', TRUE),
(NULL, 'Freelance', 'INCOME', 'Laptop', '#3B82F6', TRUE),
(NULL, 'Business Income', 'INCOME', 'Building2', '#6366F1', TRUE),
(NULL, 'Investment Income', 'INCOME', 'TrendingUp', '#8B5CF6', TRUE),
(NULL, 'Gifts', 'INCOME', 'Gift', '#EC4899', TRUE),
(NULL, 'Other Income', 'INCOME', 'PlusCircle', '#14B8A6', TRUE);
