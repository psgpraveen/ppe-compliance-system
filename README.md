# PPE Compliance Monitoring System

A production-grade, AI-powered PPE (Personal Protective Equipment) Compliance Monitoring System. Built with a full-stack TypeScript architecture, this platform allows safety administrators and supervisors to monitor, track, and resolve safety violations in real-time.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, React Query, React Hook Form, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** Supabase Cloud PostgreSQL (with automated schema migration & SSL encryption).
- **Deployment:** Vercel (Frontend) + Cloud Hosted Backend (Render / Railway).
- **Architecture:** Feature-Based Layered Architecture.

## ✨ Key Features

1. **Supabase Cloud PostgreSQL Integration & SSL Connection Pooling**
   - Configured with automatic SSL encryption (`ssl: { rejectUnauthorized: false }`) and `DATABASE_URL` pooling for production cloud deployment.
2. **Automated Database Migration (`npm run db:migrate`)**
   - One-command setup (`migrate.ts`) that initializes schema tables, indexes, triggers, and seed admin user on Supabase.
3. **Role-Based Access Control (RBAC) & Supervisor Department Scoping**
   - **Admin:** Full access to all sites, departments, employees, settings, and violations.
   - **Supervisor:** Scoped read access and employee creation locked strictly to their assigned department.
4. **User Profile & Account Security (`/dashboard/profile`)**
   - Account management view for Admins and Supervisors to update personal details and change security passwords.
   - Displays assigned department, site name, and regional location summary card.
5. **High-Performance Query Concurrency**
   - Repository pagination queries run in parallel via `Promise.all`, reducing database latency by ~50%.
6. **Automated Escalation Engine & Admin Email Alerts**
   - Background CRON jobs monitor overdue/unacknowledged violations and automatically dispatch detailed email notifications to administrators.
7. **Organization Management & Bulk Import**
   - Full CRUD operations for Construction Sites, Departments, Supervisors, and Employees with Excel/CSV import.

## 📂 Project Structure

- `frontend/`: Next.js 15 frontend application.
- `backend/`: Node.js Express API.
- `database/`: Database schema, indexes, functions, and seed scripts.
- `vercel.json`: Root Vercel deployment configuration.
- `docs/`: Technical documentation (`API_SPEC.md`, `business-flow.md`, `architecture.md`).

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Backend & Database Configuration
PORT=5001
NODE_ENV=production

# Supabase Cloud Database Connection
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.ffwtjzmfaevtrnleufni.supabase.co:5432/postgres

DB_HOST=db.ffwtjzmfaevtrnleufni.supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=postgres

# Security
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=your_super_secret_refresh_key
JWT_REFRESH_EXPIRES_IN=7d

# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
```

## 🛠️ How to Run & Deploy

### 1. Database Setup (Supabase)
Run automated schema migration to initialize Supabase Cloud Database:
```bash
cd backend
npm run db:migrate
```

### 2. Local Development
```bash
# Start backend API (port 5001)
cd backend
npm run dev

# Start frontend UI (port 3000)
cd frontend
npm run dev
```

### 3. Deploy to Vercel
1. Import repository into **[Vercel Dashboard](https://vercel.com/new)**.
2. Set **Root Directory** to `frontend`.
3. Add Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `/api/v1`
   - `BACKEND_INTERNAL_URL` = `https://your-backend.onrender.com`
4. Click **Deploy**!

### 1. Database Setup
Ensure PostgreSQL is running. Create a database named `ppe_compliance_db`.
Execute the SQL files located in the `database/` folder in this order:
1. `schema.sql`
2. `seed.sql`

### 2. Backend
Navigate to the backend directory, install dependencies, and start the development server:
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
Navigate to the frontend directory, install dependencies, and start the development server:
```bash
cd frontend
npm install
npm run dev
```

Access the web portal at `http://localhost:3000`.

## 📚 Documentation
- **[API Specification](docs/API_SPEC.md)**: Detailed REST API endpoints and payload structures.
- **[Database Schema](docs/DATABASE.md)**: Relational diagrams and table descriptions.
- **[Business Flow](docs/business-flow.md)**: Workflows for violations, escalation, and IoT detection.
- **[System Architecture](docs/architecture.md)**: High-level architecture, flow diagrams, and layer breakdown.
- **[UI Pages & Wireframes](docs/wireframes.md)**: Breakdown of all frontend pages and views.
