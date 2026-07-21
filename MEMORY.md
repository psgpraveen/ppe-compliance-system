# AI Memory & Context

This file serves as a persistent memory bank for conversations so that context can be quickly regained across sessions.

## Current Project State
- **Project**: PPE Compliance Monitoring System
- **Goal**: Production-ready, AI-powered system for construction sites tracking PPE compliance.
- **Rules Enforced**: Full-stack TypeScript. Clean Architecture, SOLID, no ORMs (raw `pg` driver). Zero `any` types.

## Completed Features (As of July 21, 2026)
1. **Authentication**: Login, Forgot/Reset Password, JWT dual-token strategy, RBAC (ADMIN/SUPERVISOR). Registration disabled — admin accounts are seeded.
2. **Sites**: Full CRUD with pagination, search, and active toggle.
3. **Departments**: Full CRUD with site and supervisor assignment.
4. **Supervisors**: Full CRUD with email-based accounts and active toggle.
5. **Employees**: Full CRUD with bulk CSV import, department/supervisor assignment.
6. **Violation Types**: Full CRUD with code, name, severity (LOW/MEDIUM/HIGH).
7. **Violations**: IoT ingestion, Acknowledge/Resolve workflow, status lifecycle.
8. **Dashboard**: Real-time stats cards, trend charts, recent violations.
9. **Analytics**: Compliance trend visualizations.
10. **IoT Simulator**: Mock camera payload test bench.
11. **Settings**: Escalation timeout, email notification toggles.
12. **Escalation Engine**: Background cron job with Gmail SMTP notifications.

## Type Safety
- Backend and frontend are fully typed with zero `any` in the codebase.
- All `onError` React Query hooks use `unknown` typed callbacks.
- All API responses use strict `ApiResponse` wrappers with typed pagination metadata.

## Documentation
- All technical docs consolidated inside `docs/` directory.
- Root `README.md` updated with full project overview and setup instructions.
