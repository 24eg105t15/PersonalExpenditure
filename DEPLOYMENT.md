# 🚀 Render Deployment Guide — SpendWise

SpendWise is configured for a clean, decoupled deployment on Render:
1. **Frontend**: Render **Static Site** (100% free, fast CDN, zero memory limit issues).
2. **Backend**: Render **Web Service** (Docker container running Java 21 Spring Boot, optimized for Render's 512MB RAM free tier).

---

## 🌟 Quick Overview: 2 Services on Render

```
               [ User Browser ]
                      │
        ┌─────────────┴─────────────┐
        ▼                           ▼
[ Render Static Site ]     [ Render Web Service ]
   (React Frontend)           (Spring Boot Backend)
https://spendwise-app       https://spendwise-backend
  .onrender.com               .onrender.com
        │                           │
        └─────── REST /api ─────────┘
                                    │
                                    ▼
                          [ Cloud Database ]
                       (MySQL 8 / TiDB / Aiven)
```

---

## 📦 Service 1: Deploy Backend (Web Service)

### Step 1: Create Web Service
1. In your [Render Dashboard](https://dashboard.render.com), click **New +** → **Web Service**.
2. Select your repository: `24eg105t15/PersonalExpenditure`.
3. Configure the following settings:
   - **Name**: `spendwise-backend`
   - **Region**: Choose your closest region (e.g., `Oregon`, `Frankfurt`, or `Singapore`)
   - **Root Directory**: `backend`
   - **Runtime**: **Docker** (Render will use `backend/Dockerfile`)
   - **Instance Type**: **Free**

### Step 2: Environment Variables
Scroll to **Environment Variables** and add:

| Key | Value | Notes |
| :--- | :--- | :--- |
| `PORT` | `10000` | Render default port |
| `CORS_ALLOWED_ORIGINS` | `*` | Or your frontend Render URL |
| `JWT_SECRET` | `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970` | Secret key for JWT |
| `SEED_DEMO_DATA` | `true` | Seeds categories and demo user |

#### Database Configuration:
- **Option A (TiDB Cloud Serverless or Aiven MySQL)**:
  - `SPRING_DATASOURCE_URL`: `jdbc:mysql://<HOST>:<PORT>/<DB_NAME>?useSSL=true&serverTimezone=UTC`
  - `SPRING_DATASOURCE_USERNAME`: `<DB_USER>`
  - `SPRING_DATASOURCE_PASSWORD`: `<DB_PASSWORD>`
- **Option B (Instant Zero-Config In-Memory Database)**:
  - If you don't have cloud MySQL ready yet, simply add:
  - `SPRING_PROFILES_ACTIVE`: `demo`
  *(Spring Boot will instantly start with in-memory H2 in MySQL compatibility mode!)*

### Step 3: Deploy Backend
Click **Create Web Service**. Wait ~2-3 minutes for the build to finish.
Once **Live**, copy your Backend URL (e.g. `https://spendwise-backend.onrender.com`).

---

## 🌐 Service 2: Deploy Frontend (Static Site)

### Step 1: Create Static Site
1. In the [Render Dashboard](https://dashboard.render.com), click **New +** → **Static Site**.
2. Select your repository: `24eg105t15/PersonalExpenditure`.
3. Configure the following settings:
   - **Name**: `spendwise-frontend`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### Step 2: Configure SPA Routing (Crucial for React Router)
Scroll down to **Redirects / Rewrites** and click **Add Rule**:
- **Source**: `/*`
- **Destination**: `/index.html`
- **Action**: **Rewrite**

*(This ensures that refreshing `/dashboard`, `/transactions`, etc. does not result in a 404).*

### Step 3: Add Backend URL Environment Variable
Under **Environment Variables**, add:

| Key | Value |
| :--- | :--- |
| `VITE_API_URL` | `https://spendwise-backend.onrender.com/api` *(replace with your actual backend URL)* |

### Step 4: Deploy Frontend
Click **Create Static Site**. It will build in ~45 seconds and provide a live URL (e.g. `https://spendwise-frontend.onrender.com`).

---

## 🎯 Verification & Login
Open your frontend URL:
- Use the **"Fill Demo"** button on the sign-in page to log in as:
  - **Email**: `demo@spendwise.com`
  - **Password**: `Demo@123`
- Or use the **"Fill Sample"** button on the registration page to register a brand new user!
