# 🚀 Render Deployment Guide — SpendWise

SpendWise is configured for a clean, decoupled deployment on Render:
1. **Frontend**: Render **Static Site** (100% free, fast CDN, zero memory limit issues).
2. **Backend**: Render **Web Service** (Docker container running Java 21 Spring Boot, optimized for Render's 512MB RAM free tier).

---

## ⚡ Option 1: 1-Click Render Blueprint (Recommended)

The repository includes a ready-to-use `render.yaml` blueprint that creates both frontend and backend automatically:

1. Go to [Render Blueprint Dashboard](https://dashboard.render.com/blueprint/new).
2. Connect your repository: `24eg105t15/PersonalExpenditure`.
3. Render will read `render.yaml` and show 2 services:
   - **`spendwise-api-v2`** (Backend Docker Web Service)
   - **`spendwise-web-v2`** (Frontend Static Site)
4. Click **Apply** / **Deploy Blueprint**.
5. Once deployed:
   - **Backend API**: `https://spendwise-api-v2.onrender.com`
   - **Frontend App**: `https://spendwise-web-v2.onrender.com`

---

## 🛠️ Option 2: Manual Service Deployment

If you prefer deploying services individually:

### 📦 1. Backend Web Service
1. In [Render Dashboard](https://dashboard.render.com), click **New +** → **Web Service**.
2. Connect `24eg105t15/PersonalExpenditure`.
3. Settings:
   - **Name**: `spendwise-api-v2`
   - **Region**: `Oregon` (or closest to you)
   - **Root Directory**: `backend`
   - **Runtime**: **Docker**
   - **Instance Type**: **Free**
4. Environment Variables:
   - `PORT`: `10000`
   - `CORS_ALLOWED_ORIGINS`: `*`
   - `JWT_SECRET`: `404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970`
   - `SEED_DEMO_DATA`: `true`
   - `SPRING_PROFILES_ACTIVE`: `demo` *(Instant in-memory MySQL-compatible database)*
5. Click **Deploy Web Service**.

### 🌐 2. Frontend Static Site
1. In [Render Dashboard](https://dashboard.render.com), click **New +** → **Static Site**.
2. Connect `24eg105t15/PersonalExpenditure`.
3. Settings:
   - **Name**: `spendwise-web-v2`
   - **Branch**: `main`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Under **Redirects / Rewrites**, add rule:
   - **Source**: `/*`
   - **Destination**: `/index.html`
   - **Action**: **Rewrite**
5. Under **Environment Variables**, add:
   - `VITE_API_URL`: `https://spendwise-api-v2.onrender.com/api` *(or your actual backend URL + `/api`)*
6. Click **Deploy Static Site**.

---

## 🎯 Verification & Demo Credentials
Once live, open your Frontend URL:
- Click **"Fill Demo"** on the Login page:
  - **Email**: `demo@spendwise.com`
  - **Password**: `Demo@123`
- *Note*: On Render's Free Tier, inactive backend services go to sleep. The very first request after sleep may take ~30 seconds to respond as the container spins up.
