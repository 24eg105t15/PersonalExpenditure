# A Summer Internship - I Project Report
## On
# “SPENDWISE: PERSONAL EXPENDITURE MANAGEMENT SYSTEM”

Submitted in partial fulfilment of the Requirements for the award of the Degree of  
**Bachelor of Technology** in **Computer Science & Engineering**

**By:**  
**ANUMANDLA SNITHESH**  
**Roll No:** `24EG105R38`

**Under the Guidance of:**  
_____________________________

**Department of Computer Science & Engineering**  
**ANURAG UNIVERSITY**  
Ghatkesar (M), Medchal District, Hyderabad - 500088  
**Academic Year:** 2026-2027

---

## CERTIFICATE

I, **ANUMANDLA SNITHESH**, bearing hall ticket number **24EG105R38**, hereby declare that the project report entitled **“SPENDWISE: PERSONAL EXPENDITURE MANAGEMENT SYSTEM”**, submitted to the Department of Computer Science & Engineering, Anurag University, Hyderabad, is a record of bonafide work carried out by me in partial fulfilment of the requirement for the award of the degree of Bachelor of Technology in Computer Science & Engineering.

This is a record of bonafide work carried out by me and the results embodied in this project report have not been submitted to any other university or institute for the award of any other degree or diploma.

<br/>

**Signature of The Guide** &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **ANUMANDLA SNITHESH**  
________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **24EG105R38**

---

## ACKNOWLEDGMENT

I would like to express my sincere thanks and deep sense of gratitude to my project supervisor _____________________, for his/her constant encouragement and inspiring guidance without which this project could not have been completed. His/her critical reviews, valuable insights, and constructive feedback significantly improved our grasp of full-stack engineering principles and steered the project to fruitful completion.

I would like to express my sincere gratitude to **Dr. Archana Mantri**, Vice Chancellor, Anurag University, and **Dr. V. Vijaya Kumar**, Dean, School of Engineering, Anurag University, for their continuous encouragement, vision, and administrative support throughout the academic tenure.

I would also like to acknowledge my sincere gratitude for the support extended by **Dr. P. Raja Sekhar Reddy**, Head of the Department, CSE Cluster-1, whose research expertise, commitment to the highest academic standards, and relentless motivation provided the right environment during the crucial stages of our project work.

Finally, I express my heartfelt gratitude to my family, faculty members, and peers who supported and encouraged me directly and indirectly during the development of this project.

**ANUMANDLA SNITHESH**  
**24EG105R38**  
Department of Computer Science & Engineering, Anurag University

---

## DECLARATION

I hereby declare that the project entitled **“SPENDWISE: PERSONAL EXPENDITURE MANAGEMENT SYSTEM”**, submitted to the Department of Computer Science & Engineering, Anurag University, Hyderabad, is an authentic record of original work carried out by me under the guidance of ___________________.

The work presented in this report has not been submitted elsewhere for the award of any other degree or diploma.

**ANUMANDLA SNITHESH**  
**24EG105R38**

---

## TABLE OF CONTENTS

| S.No | Topic | Page No |
| :---: | :--- | :---: |
| i | Acknowledgement | i |
| ii | Declaration | ii |
| iii | Abstract | iii |
| 1 | Introduction | 1 |
| 2 | Problem Statement | 3 |
| 3 | Objectives | 5 |
| 4 | Scope of the Project | 7 |
| 5 | Existing System | 9 |
| 6 | Proposed System | 11 |
| 7 | Software & Hardware Requirements | 13 |
| 8 | System Design | 15 |
| 9 | Flowchart & Algorithm | 18 |
| 10 | Modules Description | 21 |
| 11 | Implementation | 24 |
| 12 | Results / Output Screens | 28 |
| 13 | Advantages & Limitations | 32 |
| 14 | Future Enhancements | 35 |
| 15 | Conclusion | 37 |
| 16 | References | 39 |
| 17 | Source Code & Repository Structure | 41 |
| 18 | Project Summary | 46 |

---

## ABSTRACT

**SpendWise** is an enterprise-grade, cloud-native personal expenditure management web application engineered to revolutionize personal financial planning, transaction tracking, budget adherence, and savings monitoring for individuals and households. In the fast-paced modern economic environment, individuals encounter numerous challenges in tracking daily discretionary spending, managing recurring obligations, adhering to monthly category allocations, and maintaining disciplined savings habits when relying on manual spreadsheets, paper notebooks, or fragmented notes.

To resolve these challenges, SpendWise introduces a robust, modern decoupled architecture. The frontend is engineered using **React 18, Vite, TypeScript, and Tailwind CSS**, providing an ultra-responsive, accessible user interface with interactive financial visualizations. The backend is built upon **Java 21 and the Spring Boot 3.3** framework, adopting clean architectural patterns, **Spring Security 6** with stateless JSON Web Token (JWT) authentication, and **Spring Data JPA** backed by a high-performance database schema (MySQL 8 with automated Flyway database migrations and an instant in-memory H2 MySQL-compatibility profile for zero-configuration demonstrations).

SpendWise provides comprehensive end-to-end functionality including secure user authentication, interactive dashboard metrics, categorized transaction management (income vs. expense), real-time budget utilization tracking with visual threshold alerts, goal-oriented savings progress management, and one-click export of financial statements into standard CSV format. Deployed via Docker containers on Render cloud infrastructure, SpendWise guarantees high availability, sub-second latency, bank-grade credential security (BCrypt hashing), and complete multi-device responsiveness, establishing a dependable digital ecosystem for personal wealth stewardship.

---

## 1. INTRODUCTION

The **SpendWise Personal Expenditure Management System** is a comprehensive web-based application designed to digitalize, streamline, and modernize the manner in which individuals record, analyze, and manage their personal finances. In today’s digital age, economic transactions occur rapidly across multiple channels—cash, debit/credit cards, UPI, digital wallets, and net banking. Consequently, maintaining an accurate, consolidated overview of cash flow has become an increasingly daunting responsibility for students, working professionals, and households.

Traditionally, individuals have attempted to monitor their personal spending through physical diary entries, paper receipts, or static spreadsheets like Microsoft Excel. While these manual methods offer initial familiarity, they suffer from significant drawbacks: they are tedious, time-consuming, highly susceptible to calculation errors, incapable of providing proactive budget breach alerts, and vulnerable to catastrophic data loss due to physical damage or file corruption. Moreover, traditional methods lack real-time visual insights, leaving users unaware of subtle "cash leaks" and impulsive spending patterns until their monthly capital is depleted.

With the rapid evolution of cloud computing and web technologies, there is an imperative need for an intuitive, secure, and automated personal finance platform. SpendWise answers this need by delivering a lightweight yet technologically robust full-stack solution. The front-end leverages React, Vite, and Tailwind CSS to guarantee blistering rendering speeds, modern aesthetic appeal, and seamless responsiveness across desktops, laptops, tablets, and smartphones. The back-end is powered by enterprise-grade Java 21 and Spring Boot 3, providing rock-solid RESTful endpoints, bulletproof stateless JWT authentication, and resilient data persistence.

Through SpendWise, users gain complete visibility and control over their financial journey. The application empowers users to register secure personal profiles, record detailed income and expense transactions, categorize spending into essential and discretionary buckets, set monthly budgetary caps with real-time progress indicators, define structured savings milestones, and export comprehensive statements. In summary, SpendWise bridges the gap between intricate financial management and effortless daily usability, fostering disciplined financial habits and long-term economic well-being.

---

## 2. PROBLEM STATEMENT

Effective personal financial management is essential for financial independence and peace of mind. However, the majority of individuals struggle with financial tracking due to the inherent shortcomings of conventional and manual methodologies:

1. **High Propensity for Human Calculation Errors**: Manual arithmetic in paper registers or spreadsheets frequently results in erroneous balances, miscategorized transactions, and conflicting monthly totals.
2. **Time Consumption and Disorganization**: Recording transactions by hand at the end of every day or week is cumbersome. Over time, physical notebooks become disorganized, damaged, or lost, making retrospective audits practically impossible.
3. **Absence of Proactive Budget Alerts**: Static spreadsheets cannot notify a user when their dining, entertainment, or shopping expenditures are nearing or exceeding their monthly limit.
4. **Lack of Intuitive Visual Analytics**: Raw tables of numbers fail to clearly convey spending trends, income-to-expense ratios, and category distributions, preventing users from making timely corrective financial decisions.
5. **Security and Privacy Vulnerabilities**: Physical notebooks or unencrypted local spreadsheets leave sensitive personal financial data exposed to unauthorized viewing, accidental deletion, or hardware crashes.
6. **Generic, Ad-Riddled Existing Apps**: Many commercial mobile applications require intrusive banking SMS permissions, bombard users with targeted loan advertisements, or lock essential budgeting features behind expensive recurring subscriptions.

Therefore, there is an urgent demand for a dedicated, secure, user-centric, and automated Personal Expenditure Management System that guarantees complete data ownership, real-time analytics, automated budget monitoring, and seamless cloud accessibility without intrusive tracking.

---

## 3. OBJECTIVES

The primary objective of SpendWise is to conceptualize, engineer, and deploy an automated, reliable, and user-friendly web application that simplifies personal expense tracking, optimizes budget allocation, and cultivates healthy financial habits. The specific objectives include:

- **Automated Transaction Tracking**: Provide a swift, intuitive interface for logging income and expense entries with amount, category, date, payment method, and descriptive notes.
- **Robust User Authentication and Privacy**: Implement industry-standard security utilizing BCrypt password hashing and stateless JSON Web Tokens (JWT) to safeguard confidential user profiles.
- **Dynamic Budget Monitoring**: Allow users to define monthly category budgets (e.g., Groceries, Utilities, Entertainment) and track spending against these limits in real-time with visual warning thresholds.
- **Goal-Oriented Savings Management**: Enable users to establish specific savings targets (e.g., Emergency Fund, Vacation, New Laptop) and log incremental deposits toward those goals.
- **Comprehensive Analytics Dashboard**: Render instant high-level summaries including Total Balance, Monthly Income, Monthly Expenses, Savings Rate, and visual breakdown charts.
- **Export and Reporting Capabilities**: Implement automated data serialization to allow users to download their complete transaction logs in standard CSV format for external auditing or tax preparation.
- **Cross-Device Responsiveness and Cloud Deployment**: Build a responsive interface with Tailwind CSS and package the backend into a containerized Docker image deployed on Render cloud infrastructure with zero operational barriers.

---

## 4. SCOPE OF THE PROJECT

The scope of SpendWise encompasses the end-to-end lifecycle of personal financial tracking, spanning user acquisition to structured analytical reporting:

- **User Domain**: Individual users, students, freelancers, and household managers seeking an ad-free, secure platform to track cash flow and avoid debt traps.
- **Functional Scope**: User registration, secure login, password management, profile customization, dynamic category management, transaction CRUD operations, budget tracking, savings goal management, and data export.
- **Architectural Scope**: A decoupled client-server architecture where the frontend (React Vite SPA) communicates with the backend (Java Spring Boot) exclusively via secure RESTful JSON APIs.
- **Deployment Scope**: Automated deployment pipelines utilizing containerized Docker runtimes on Render cloud, supporting cloud-hosted MySQL databases as well as zero-setup in-memory database profiles for seamless demonstrations.
- **Scalability Scope**: While optimized for individual single-user tenancy per account, the backend architecture supports multi-tenant isolation, allowing thousands of simultaneous users to manage their data with strict row-level security.

---

## 5. EXISTING SYSTEM

The prevailing approaches to personal finance management typically fall into three traditional categories:

### 1. Manual Paper Registers / Physical Passbooks
Users write receipts and expenditures by hand into diaries. This system is completely manual, lacks search functionality, provides zero analytical charts, and is vulnerable to theft, moisture, and fire damage.

### 2. Desktop Spreadsheets (Microsoft Excel / Google Sheets)
Users manually maintain tabular spreadsheets. While formulas can compute totals, creating dynamic charts requires advanced spreadsheet skills. Furthermore, updating spreadsheets from mobile devices is clumsy, and there are no automated budget notifications.

### 3. Proprietary Commercial Expense Apps
Many commercial mobile apps read personal SMS messages without user comprehension, upload financial habits to marketing servers, lock multi-category features behind paywalls, or shut down unpredictably.

**Key Limitations:**
- High manual effort and calculation fatigue
- Risk of data loss and zero cloud backup
- Intrusive advertising and commercial data harvesting
- No automated visual budget consumption alerts
- Clunky navigation on mobile browsers

---

## 6. PROPOSED SYSTEM

SpendWise replaces the fragile, manual paradigms of existing systems with an automated, responsive, cloud-accessible, and private financial command center.

In SpendWise, every user interacts with a secure, beautifully crafted user interface. Transactions are committed to a relational database within milliseconds. Real-time calculations provide immediate updates to financial ratios, budget consumption meters, and savings goal progress.

### Key Innovations of SpendWise:
- **Centralized Cloud Storage**: Financial records are persisted securely and accessible anywhere across any device via standard web browsers.
- **Stateless JWT Authentication**: Zero session memory leaks on servers; tokens expire securely and refresh without user disruption.
- **Visual Feedback & Gamification**: Progress bars transition from green to amber and red as budgets reach 75% and 90% utilization, giving immediate psychological cues against overspending.
- **One-Click Demo Autofill**: Embedded demo capabilities pre-seed realistic multi-month data, allowing recruiters, evaluators, and prospective users to experience the application instantly.
- **Audit-Ready Data Export**: Export complete transaction histories into standard CSV formats in a single click.

---

## 7. SOFTWARE & HARDWARE REQUIREMENTS

### Software Requirements
| Component | Specification / Technology |
| :--- | :--- |
| **Operating System** | Windows 10/11, macOS, or Ubuntu Linux (Docker compatible) |
| **Backend Runtime** | Java Development Kit (JDK) 21 (LTS) |
| **Backend Framework** | Spring Boot 3.3.4 (Web, Data JPA, Security, Actuator, Validation) |
| **Security & Auth** | Spring Security 6, JJWT 0.12.6 (HMAC-SHA256), BCrypt |
| **Database** | MySQL 8.0 (Production) / H2 In-Memory DB (Demo Profile) |
| **Database Migration** | Flyway 10.x Database Migration Engine |
| **Frontend Runtime** | Node.js v20.x or v24.x & npm v10.x |
| **Frontend Framework** | React 18 with TypeScript 5.x |
| **Build Tool & Bundler** | Vite 8.x / 5.x with Hot Module Replacement (HMR) |
| **Styling & UI** | Tailwind CSS, Lucide React Icons, React Hot Toast |
| **Form Management** | React Hook Form, Zod Validation Schema |
| **HTTP Client** | Axios 1.7.x with Custom Request & Response Interceptors |
| **Cloud Platform** | Render (Docker Web Service for Backend + Static Site for Frontend) |
| **IDE & Version Control** | VS Code / IntelliJ IDEA, Git & GitHub |

### Hardware Requirements
- **Processor**: Intel Core i3 / AMD Ryzen 3 or higher (Intel Core i5 recommended).
- **RAM**: Minimum 4 GB (8 GB recommended for simultaneous Spring Boot JVM + Vite runtime).
- **Storage**: Minimum 256 GB SSD with at least 5 GB free disk space.
- **Network**: Internet connection for cloud hosting and Maven/NPM package resolution.
- **Display**: Minimum screen resolution of 1366x768 (Full HD 1920x1080 recommended).

---

## 8. SYSTEM DESIGN

### Architectural Overview
SpendWise adopts a tiered, decoupled **Clean Architecture** pattern separating Presentation, Application/Service, and Data Persistence layers:
1. **Presentation Tier (Client)**: Single Page Application built in React. Encapsulates state using React Context API (`AuthContext`), manages client routing via React Router DOM 6, and executes authenticated asynchronous HTTP requests via Axios.
2. **API Gateway / Security Filter**: Spring Security interceptor chain inspecting HTTP `Authorization: Bearer <JWT>` headers on all protected `/api/**` routes. Unauthenticated requests are rejected with standardized RFC 7807 JSON error responses.
3. **Service Tier**: Business logic components (`TransactionService`, `BudgetService`, `SavingsService`, `ReportService`, `AuthService`) carrying out validations, calculations, and transactional boundaries (`@Transactional`).
4. **Data Tier**: Spring Data JPA repositories interfacing with Hibernate ORM and MySQL dialect engines to execute optimized queries with row-level security bound to the authenticated user ID.

### Entity-Relationship Design (Key Entities)
- **User**: Stores account credentials (`email`, `password_hash`, `name`, `currency`, `created_at`).
- **Category**: Defines spending classifications (`name`, `type: INCOME/EXPENSE`, `color_code`, `icon`, `user_id`).
- **Transaction**: Financial entries (`amount`, `type`, `date`, `description`, `payment_method`, `category_id`, `user_id`).
- **Budget**: Monthly category spending caps (`month`, `year`, `allocated_amount`, `category_id`, `user_id`).
- **SavingsGoal**: Long-term asset accumulation targets (`title`, `target_amount`, `current_amount`, `target_date`, `user_id`).
- **SavingsGoalEntry**: Individual deposit logs towards a specific savings goal.

---

## 9. FLOWCHART & ALGORITHM

### Algorithm 1: User Authentication & JWT Issuance
- **Step 1**: User submits login form with email and plaintext password.
- **Step 2**: Client performs local Zod schema validation (valid email format and non-empty password).
- **Step 3**: Client dispatches POST request to `/api/auth/login`.
- **Step 4**: Server queries `UserRepository` for matching email. If not found, returns HTTP 401 Unauthorized.
- **Step 5**: Server invokes `PasswordEncoder.matches(plaintext, storedHash)` using BCrypt. If false, returns HTTP 401.
- **Step 6**: Server generates HMAC-SHA256 signed JWT containing Subject (User ID), IssuedAt, and Expiration (24 hours).
- **Step 7**: Server returns HTTP 200 with JWT and user metadata. Client caches JWT in `localStorage` and redirects to `/dashboard`.

### Algorithm 2: Transaction Creation & Real-Time Balance Update
- **Step 1**: User opens "Add Transaction" modal, enters amount, category, date, and type (Income/Expense).
- **Step 2**: Axios attaches `Bearer <token>` and posts payload to `/api/transactions`.
- **Step 3**: Spring Boot extracts user ID from SecurityContext token.
- **Step 4**: Validates category belongs to the user or is a global default. Validates amount > 0.
- **Step 5**: Persists transaction entity inside database transaction (`@Transactional`).
- **Step 6**: Returns updated transaction object. Frontend state updates automatically, recomputing total balance and monthly totals without full page reload.

### Algorithm 3: Budget Utilization & Warning Threshold Engine
- **Step 1**: When user navigates to `/budgets`, backend receives request for current month and year.
- **Step 2**: Query fetches all budgets allocated by the user for month $M$ and year $Y$.
- **Step 3**: For each budget category, query computes sum of all expense transactions: $\text{ActualSpent} = \sum \text{amount}$.
- **Step 4**: Computes $\text{PercentageUsed} = (\text{ActualSpent} / \text{AllocatedAmount}) \times 100$.
- **Step 5**: Classifies status:
  - $\text{Percentage} < 75\% \rightarrow \text{Normal (Green)}$
  - $75\% \le \text{Percentage} < 90\% \rightarrow \text{Warning (Amber)}$
  - $\text{Percentage} \ge 90\% \rightarrow \text{Critical / Exceeded (Red)}$
- **Step 6**: Returns DTO to frontend; UI renders animated progress bars with contextual warnings.

---

## 10. MODULES DESCRIPTION

1. **Authentication & Profile Module**: Manages registration, login, credential validation, and session teardown. Features one-click demo credentials autofill (`demo@spendwise.com` / `Demo@123`).
2. **Dashboard Module**: High-level financial control center summarizing Net Worth, Monthly Inflow, Monthly Outflow, Savings Rate, and recent activity.
3. **Transaction Management Module**: Complete CRUD suite for income and expense logs with multi-parameter filtering, pagination, and sorting.
4. **Category Module**: Configurable classification system allowing personalized expense tagging, color coding, and icon customization.
5. **Budget Module**: Monthly spending limits per category with dynamic progress meters and visual threshold alarms.
6. **Savings Goal Module**: Dedicated tracker for milestone financial targets, computing percentage progress and remaining amounts.
7. **Reports & Export Module**: Formats comprehensive cash-flow reports and delivers single-click downloads in RFC 4180 CSV spreadsheet format.

---

## 11. IMPLEMENTATION

### Backend Architecture
- **Framework**: Spring Boot 3.3.4 running on Java 21 LTS.
- **Security Pipeline**: `SecurityConfig.java` defines stateless filter chain, disables session cookies, and registers `JwtAuthenticationFilter` before `UsernamePasswordAuthenticationFilter`.
- **CORS Architecture**: Uses `setAllowedOriginPatterns("*")` to support credentials across dynamic cloud URLs on Render.
- **Dual-Profile Database**:
  - `prod`: MySQL 8 via HikariCP with Flyway schema migration.
  - `demo`: In-memory H2 database in MySQL mode (`MODE=MySQL;DB_CLOSE_DELAY=-1`) enabling instant 15-second cold starts.
- **Memory Optimization**: Multi-stage Dockerfile using Alpine JRE (`eclipse-temurin:21-jre-alpine`) configured with JVM flags `-Xmx350m -Xms128m -XX:+UseG1GC` specifically engineered for Render's 512MB RAM free-tier limit.

### Frontend Architecture
- **Framework**: React 18, Vite 8, TypeScript 5, Tailwind CSS.
- **Dynamic API Auto-Discovery (`api.ts`)**: Automatically discovers backend URL:
  - Priority 1: User `localStorage` override
  - Priority 2: Build-time `VITE_API_URL`
  - Priority 3: Dynamic Render hostname pair mapping (e.g. `spendwise-web.onrender.com` $\rightarrow$ `spendwise-api.onrender.com/api`)
  - Priority 4: Local development `/api` proxy.
- **Axios Interceptor**: Injects `Authorization: Bearer <token>` into all outbound requests and handles HTTP 401 session expiry gracefully.

---

## 12. RESULTS / OUTPUT SCREENS

1. **Public Landing Page**: Hero banner introducing features, benefits, and call-to-action buttons.
2. **Authentication Screen**: Secure sign-in form with "Fill Demo" shortcut and password eye toggle.
3. **Analytics Dashboard**: Metric cards for Balance, Income, Expense, Savings, and recent transaction feeds.
4. **Transactions Page**: Interactive data table with category badges, date range pickers, and search bars.
5. **Budgets Page**: Categorized budget cards with visual progress bars (green/amber/red).
6. **Savings Goals Page**: Target cards showing accumulated funds, deadlines, and milestone deposits.
7. **CSV Statement Export**: Instant download of formatted financial audit spreadsheets.

---

## 13. ADVANTAGES & LIMITATIONS

### Advantages
- Zero arithmetic or calculation errors.
- Absolute data privacy and ownership (no ads, no financial data reselling).
- Enterprise-grade security with BCrypt and stateless JWTs.
- Fluid multi-device experience on mobile, tablet, and desktop.
- Zero-friction demo account with multi-month pre-seeded data.

### Limitations
- Cloud free-tier cold-start latency (~30 seconds on initial wake-up).
- Manual transaction logging (no direct open-banking API access).
- Single currency support per user account in current version.

---

## 14. FUTURE ENHANCEMENTS

1. **AI Receipt OCR Scanning**: Camera capture and automated parsing of physical receipts via Tesseract OCR.
2. **Predictive Expense Forecasting**: Machine learning models predicting end-of-month cash balances.
3. **Open Banking Integration**: Plaid / Account Aggregator API sync for automated bank transaction import.
4. **Native Mobile Apps**: Cross-platform React Native / Flutter apps with mobile push notifications.
5. **Shared Family Wallets**: Multi-user collaborative budgeting with role-based permissions.

---

## 15. CONCLUSION

The **SpendWise Personal Expenditure Management System** successfully modernizes and digitalizes personal financial management. By combining React 18, Vite, TypeScript, Tailwind CSS, Java 21, Spring Boot 3, and containerized Docker deployment on Render, SpendWise demonstrates how modern software engineering principles can be applied to solve real-world financial challenges.

SpendWise delivers high reliability, rock-solid security, intuitive usability, and cross-device responsiveness, establishing a dependable platform for sustainable financial wellness.

---

## 16. REFERENCES

1. Spring Boot Documentation. Pivotal / VMware. https://docs.spring.io/spring-boot/
2. Spring Security 6 Reference. https://docs.spring.io/spring-security/reference/
3. React 18 Documentation. Meta Open Source. https://react.dev
4. Vite Documentation. https://vitejs.dev
5. JSON Web Token RFC 7519. IETF. https://tools.ietf.org/html/rfc7519
6. Tailwind CSS Framework. Tailwind Labs. https://tailwindcss.com
7. Docker Multi-Stage Builds. Docker Inc. https://docs.docker.com/build/
8. Render Cloud Deployment Guides. https://render.com/docs
9. Martin, Robert C. *Clean Architecture*. Prentice Hall, 2017.
10. Walls, Craig. *Spring in Action, Sixth Edition*. Manning Publications, 2022.

---

## 17. SOURCE CODE & REPOSITORY STRUCTURE

```
SpendWise-PersonalExpenditure/
├── backend/
│   ├── pom.xml                               # Java 21 & Spring Boot 3.3.4
│   ├── Dockerfile                            # Optimized Alpine JRE container
│   └── src/main/
│       ├── java/com/spendwise/
│       │   ├── SpendwiseBackendApplication.java
│       │   ├── config/                       # SecurityConfig, JwtAuthenticationFilter
│       │   ├── controller/                   # Auth, Transaction, Budget, Savings, Report
│       │   ├── dto/                          # Request/Response DTO models
│       │   ├── entity/                       # JPA Database Entities
│       │   ├── repository/                   # Spring Data JPA Repositories
│       │   └── service/                      # Core Business Logic & Data Seeder
│       └── resources/
│           ├── application.yml               # Multi-profile config (MySQL & H2 demo)
│           └── db/migration/                 # Flyway SQL migrations
├── frontend/
│   ├── package.json                          # React 18, Vite, Tailwind CSS, Axios
│   ├── vite.config.ts                        # Vite bundler configuration
│   ├── tailwind.config.js                    # Design tokens & theme colors
│   └── src/
│       ├── App.tsx                           # Main route definitions
│       ├── components/                       # Reusable UI components & layouts
│       ├── context/AuthContext.tsx           # Global authentication state
│       ├── pages/                            # Auth, Dashboard, Transactions, Budgets
│       ├── services/api.ts                   # Axios client with auto-discovery
│       └── types/index.ts                    # TypeScript interface definitions
├── render.yaml                               # Render Infrastructure-as-Code
└── README.md                                 # Complete documentation
```

---

## PROJECT SUMMARY

The SpendWise Personal Expenditure Management System was successfully designed, developed, containerized, and deployed as an enterprise-grade full-stack web application. The project achieved all targeted milestones across every phase of software engineering—from comprehensive requirement elicitation and relational database modeling to modular REST API development, responsive component creation, and cloud orchestration.

By replacing antiquated paper registers and fragile spreadsheets with an automated, responsive digital platform, SpendWise empowers users with accurate financial awareness, proactive budget safeguards, and disciplined savings motivation. The project demonstrated the formidable capabilities of modern web technologies—combining the reactivity of React 18 and Vite with the rock-solid dependability of Java 21 Spring Boot and Docker.
