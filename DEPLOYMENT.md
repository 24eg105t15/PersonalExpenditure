# 🚀 Render Deployment Guide — SpendWise

SpendWise is configured for **turnkey deployment on Render** using a multi-stage Docker build that packages both the React TypeScript frontend and the Java 21 Spring Boot backend into a single high-performance web service container.

---

## 🏗️ Architecture on Render

- **Web Service**: Runs the unified Docker container (serves React SPA on `/` and Spring REST APIs on `/api/**`).
- **Port Handling**: Render automatically injects `PORT`, which Spring Boot listens to dynamically.
- **Database**: Connects to any standard cloud MySQL 8 database instance (e.g. TiDB Cloud Serverless, Aiven for MySQL, or Clever Cloud).

---

## ⚡ Step-by-Step Deployment on Render

### Step 1: Set Up a Free Cloud MySQL Database (Choose One)

SpendWise requires a standard MySQL 8.x database. You can obtain a free cloud MySQL database in 1 minute from:

#### Option A: TiDB Cloud Serverless (Recommended — 5GB Free Forever)
1. Go to [https://tidbcloud.com](https://tidbcloud.com) and create a free account.
2. Click **Create Cluster** → Select **Serverless** (Free).
3. Under **Connect**, note your:
   - **Host** (e.g. `gateway01.us-east-1.prod.aws.tidbcloud.com`)
   - **Port** (usually `4000`)
   - **User** (e.g. `xxxx.root`)
   - **Password**
   - **Database Name** (e.g. `test` or `spendwise`)

#### Option B: Aiven for MySQL (Free Tier)
1. Go to [https://aiven.io](https://aiven.io) and register.
2. Create a free **MySQL** service.
3. Copy the **Service URI** or Host, Port, User, and Password.

---

### Step 2: Deploy on Render

1. Log in to [https://dashboard.render.com](https://dashboard.render.com).
2. Click **New +** in the top right → Select **Web Service**.
3. Under **Connect a repository**, select your repository:
   ```
   24eg105t15/PersonalExpenditure
   ```
   *(If not visible, click "Configure account" to grant Render access to the repository).*
4. Fill in the service details:
   - **Name**: `spendwise-app` (or any name you choose)
   - **Region**: Choose the region closest to you (e.g., Oregon, Frankfurt, Singapore)
   - **Runtime**: **Docker** (Render will automatically detect the root `Dockerfile`)
   - **Instance Type**: **Free**

---

### Step 3: Configure Environment Variables

Scroll down to the **Environment Variables** section on Render and click **Add Environment Variable**:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `SPRING_DATASOURCE_URL` | `jdbc:mysql://<HOST>:<PORT>/<DATABASE>?useSSL=true&serverTimezone=UTC` | Your cloud MySQL JDBC URL |
| `SPRING_DATASOURCE_USERNAME` | `your_db_username` | MySQL Username |
| `SPRING_DATASOURCE_PASSWORD` | `your_db_password` | MySQL Password |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | 256+ bit secret for signing JWTs |
| `SEED_DEMO_DATA` | `true` | Pre-seeds categories and demo account on first startup |

*(Alternatively, you can provide `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` individually).*

---

### Step 4: Launch & Verify

1. Click **Create Web Service**.
2. Render will trigger the multi-stage build:
   - Compiles React with Vite (`npm run build`)
   - Compiles Spring Boot (`mvn clean package`)
   - Bundles the lightweight Alpine JRE container
   - Runs Flyway migrations automatically on startup
3. Once the status shows **Live**, open your public URL:
   ```
   https://spendwise-app.onrender.com
   ```
4. Log in using the pre-seeded demo account:
   - **Email**: `demo@spendwise.com`
   - **Password**: `Demo@123`
   Or register a new account!
