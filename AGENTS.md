# AGENTS.md

# PPE Compliance Monitoring System

## Project Goal

Build a production-ready PPE Compliance Monitoring System for construction sites.

This is NOT a college project.

Write code as if it will be deployed in production and maintained by a software team.

---

# Core Principles

- Write clean, maintainable code.
- Follow SOLID principles.
- Follow Clean Architecture.
- Keep business logic separate from infrastructure.
- Never duplicate code.
- Every file should have a single responsibility.
- Prefer readability over clever code.
- Always write scalable code.

---

# Development Workflow

IMPORTANT

Never build the entire application at once.

We develop ONE FEATURE at a time.

Each feature must be completely finished before moving to the next.

A feature is complete only after:

- Database
- Backend
- Frontend
- API Integration
- Validation
- Error Handling
- Loading States
- Testing
- Documentation

are completed.

Never generate future modules unless requested.

---

# Tech Stack

## Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- TanStack Query
- Axios
- React Hot Toast
- Recharts

## Backend

- Node.js
- Express.js

## Database

- PostgreSQL (Supabase)

Database Driver

- pg

NO ORM

Never use:

- Prisma
- Sequelize
- TypeORM

---

# Backend Architecture

Always follow

Route

↓

Controller

↓

Service

↓

Repository

↓

PostgreSQL

Rules

Controllers

- Receive request
- Validate input
- Call service
- Return response

Never write business logic inside controllers.

Services

- Business logic only

Repositories

- SQL only

Never write SQL inside controllers or services.

---

# Frontend Architecture

Feature Based

```
src/

features/

shared/

components/

layouts/

hooks/

services/

types/

utils/
```

Each feature contains

- components
- hooks
- services
- validation
- types
- pages

---

# Folder Structure

```
project/

frontend/

backend/
```

Backend

```
src/

modules/

config/

middleware/

repositories/

controllers/

routes/

services/

validators/

utils/

cron/

shared/
```

Frontend

```
src/

features/

shared/

components/

layouts/

services/

hooks/
```

---

# Authentication

Roles

ADMIN

SUPERVISOR

JWT Authentication

bcrypt Password Hashing

Role Based Authorization

Protected Routes

---

# API Standards

Version every API.

Example

```
/api/v1/auth/login
```

Responses

Success

```json
{
    "success": true,
    "message": "",
    "data": {}
}
```

Failure

```json
{
    "success": false,
    "message": "",
    "errors": []
}
```

Never return inconsistent response formats.

---

# Validation

Always validate

Request Body

Params

Query

Use express-validator.

Never trust frontend validation.

---

# Error Handling

Always use centralized error middleware.

Never wrap every controller in repetitive try/catch blocks if a shared async handler is available.

Never expose stack traces.

---

# Logging

Use Morgan.

Log

Request

Response Status

Response Time

Future logging should be easy to replace with Winston or Pino.

---

# Environment Variables

Never hardcode

Passwords

JWT Secret

Database URLs

API Keys

Always use

.env

Provide

.env.example

---

# Database Rules

Use PostgreSQL best practices.

Use

Foreign Keys

Indexes

Constraints

Transactions where needed

Parameterized Queries only.

Never concatenate SQL strings.

---

# Coding Standards

Use async/await.

Never use nested callbacks.

Prefer small reusable functions.

Use meaningful names.

Avoid magic numbers.

Avoid duplicate logic.

---

# Git Workflow

Every feature should be committed separately.

Example

feat(auth): complete authentication

feat(department): CRUD completed

feat(supervisor): module completed

Never mix multiple features in one commit.

---

# Testing

Every feature must include

Manual Testing Steps

Expected Result

Possible Edge Cases

---

# Documentation

Update README after every completed feature.

Document

New APIs

Environment Variables

Database Changes

Folder Changes

---

# Development Order

Feature 1

Authentication

Feature 2

Departments

Feature 3

Supervisors

Feature 4

Employees

Feature 5

Violation Types

Feature 6

IoT API

Feature 7

Violations

Feature 8

Dashboard

Feature 9

Reports

Feature 10

Settings

Feature 11

Alert Engine

---

# IoT Rules

Current source

Postman

Future source

Real IoT Devices

Backend should never require modification when moving from Postman to real devices.

Current endpoint

POST /api/v1/iot/violations

Future endpoints

POST /api/v1/iot/compliance

POST /api/v1/iot/device-status

POST /api/v1/iot/device-heartbeat

---

# Business Rules

Admin

- Manage Departments
- Manage Supervisors
- Manage Employees
- Configure Settings
- View Reports
- View Analytics
- View All Violations

Supervisor

- View Assigned Department
- Manage Assigned Employees
- View Violations
- Acknowledge Violations
- Export Reports

Employees do not log in.

---

# Code Generation Rules

When implementing a feature, always generate

1. Database changes
2. Backend
3. Frontend
4. API Integration
5. Validation
6. Error Handling
7. Testing Guide
8. README Update

Do not generate code for future features.

Wait for user approval before moving to the next feature.

---

# Final Rule

Prioritize

Maintainability

Scalability

Readability

Security

Performance

over writing the shortest code.