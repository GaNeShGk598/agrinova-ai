# AgriNova AI — Deployment Guide

## Frontend → Vercel

### 1. Push to GitHub
```bash
git add .
git commit -m "chore: production ready"
git push origin main
```

### 2. Import on Vercel
- Go to https://vercel.com/new
- Import your GitHub repo
- Set **Root Directory** to `artifacts/agrinova`
- **Build Command**: `vite build --config vite.config.production.ts`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 3. Add Environment Variable on Vercel
| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://your-backend.railway.app` |

### 4. Deploy
Click **Deploy**. Vercel will build and host the frontend.

---

## Backend → Railway

### 1. Create Railway project
- Go to https://railway.app/new
- Select **Deploy from GitHub repo**
- Point to your repo, set **Root Directory** to `deploy/backend`
  *(or copy backend files there first)*

### 2. Add MySQL plugin
- In Railway project → **Add Plugin** → **MySQL**
- Railway auto-injects `MYSQL_URL`; or use the individual variables below

### 3. Set Environment Variables on Railway
| Key | Value |
|-----|-------|
| `DB_HOST` | From Railway MySQL plugin |
| `DB_PORT` | `3306` |
| `DB_NAME` | `agrinova` |
| `DB_USER` | From Railway MySQL plugin |
| `DB_PASSWORD` | From Railway MySQL plugin |
| `JWT_SECRET` | Random 64-char string |
| `CORS_ORIGINS` | `https://your-app.vercel.app` |
| `ML_SERVICE_URL` | URL of ML service (or `http://localhost:9000` if not used) |

### 4. Run DB migration
In Railway's shell or a one-off command:
```bash
mysql -h $DB_HOST -u $DB_USER -p$DB_PASSWORD $DB_NAME < schema.sql
```

### 5. Deploy
Railway auto-deploys on push. The Dockerfile handles the build.

---

## Backend → Render (Alternative)

1. New Web Service → connect GitHub repo
2. **Root Directory**: `deploy/backend` (or root of your backend)
3. **Build Command**: `pip install -r requirements.txt`
4. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add a **PostgreSQL** or **MySQL** add-on, set env vars same as above

---

## Local Development

### Frontend
```bash
cd artifacts/agrinova
cp .env.example .env.local
# Edit .env.local: set VITE_API_URL=http://localhost:8000
npm install
npm run dev
```

### Backend (Python FastAPI)
```bash
cd backend          # or wherever your backend lives
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MySQL credentials
uvicorn main:app --reload --port 8000
```

### MySQL (local)
```bash
mysql -u root -p < deploy/database/schema.sql
```

---

## Environment Variable Summary

### Frontend (.env.local / Vercel)
```
VITE_API_URL=https://your-backend.railway.app
```

### Backend (.env / Railway)
```
DB_HOST=...
DB_PORT=3306
DB_NAME=agrinova
DB_USER=...
DB_PASSWORD=...
JWT_SECRET=...
CORS_ORIGINS=https://your-app.vercel.app
ML_SERVICE_URL=http://localhost:9000
APP_ENV=production
```
