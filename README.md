# PPE Compliance Monitoring System

A production-grade, AI-powered PPE (Personal Protective Equipment) Compliance Monitoring System. Built with a full-stack TypeScript architecture, this platform allows safety administrators and supervisors to monitor, track, and resolve safety violations in real-time.

## 🚀 Tech Stack

- **Frontend:** Next.js 15 (App Router), React, Tailwind CSS, React Query, React Hook Form, Lucide Icons.
- **Backend:** Node.js, Express, TypeScript.
- **Database:** PostgreSQL (with manual schema and seed scripts).
- **Architecture:** Feature-Based Layered Architecture.

## ✨ Key Features

1. **Role-Based Access Control (RBAC)**
   - **Admin:** Full access to all sites, departments, employees, settings, and violations.
   - **Supervisor:** Scoped access to assigned departments, employees, and violations.
2. **Real-time Dashboard & Analytics**
   - Live metrics for Total Violations, Open Alerts, Escalated cases, and Resolved cases.
   - Visual trend charts and recent violation tracking.
3. **Automated Escalation Engine**
   - Background CRON jobs monitor overdue/unacknowledged violations and automatically escalate them to administrators via email.
4. **Organization Management**
   - Full CRUD operations for Construction Sites, Departments, Supervisors, and Employees.
   - Bulk import capabilities for Employees via Excel/CSV.
5. **IoT Integration & Simulator**
   - Built-in simulator to mock IoT camera payloads detecting PPE violations (e.g., No Helmet, No Vest).
6. **Strict Type Safety**
   - End-to-end TypeScript with zero generic `any` types. Fully typed React Query hooks and Express API responses.

## 📂 Project Structure

- `frontend/`: Next.js 15 frontend application.
- `backend/`: Node.js Express API.
- `database/`: Database schema and mock seed scripts.
- `docs/`: Technical documentation (`API_SPEC.md`, `BUSINESS_FLOW.md`, `DATABASE.md`, etc).

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Backend Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=ppe_compliance_db

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

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

## 🛠️ How to Run

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
- **[API Specification](API_SPEC.md)**: Detailed REST API endpoints and payload structures.
- **[Database Schema](DATABASE.md)**: Relational diagrams and table descriptions.
- **[Business Flow](BUSINESS_FLOW.md)**: Workflows for violations, escalation, and IoT detection.
