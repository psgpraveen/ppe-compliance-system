# Database Schema & Design

This document details the PostgreSQL relational database schema, tables, constraints, index strategy, and ER diagram for the PPE Compliance Monitoring System.

---

## 1. Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    USERS {
        uuid id PK
        varchar first_name
        varchar last_name
        varchar email UK
        text password_hash
        varchar role "ADMIN | SUPERVISOR"
        boolean is_active
        timestamptz last_login
        timestamptz created_at
        timestamptz updated_at
    }

    SITES {
        uuid id PK
        varchar site_name
        text location
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    DEPARTMENTS {
        uuid id PK
        uuid site_id FK
        uuid supervisor_id FK
        varchar name
        timestamptz created_at
        timestamptz updated_at
    }

    EMPLOYEES {
        uuid id PK
        varchar employee_code UK
        varchar first_name
        varchar last_name
        uuid department_id FK
        uuid supervisor_id FK
        varchar job_profile
        varchar mobile_number
        varchar aadhar_number
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    VIOLATION_TYPES {
        uuid id PK
        varchar code UK
        varchar name
        varchar severity "LOW | MEDIUM | HIGH"
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    IOT_DEVICES {
        uuid id PK
        varchar device_code UK
        varchar device_name
        varchar serial_number
        uuid site_id FK
        uuid department_id FK
        varchar firmware_version
        varchar status "ONLINE | OFFLINE"
        timestamptz last_heartbeat
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    VIOLATIONS {
        uuid id PK
        uuid employee_id FK
        uuid violation_type_id FK
        uuid iot_device_id FK
        timestamptz detected_at
        varchar status "DETECTED | PENDING | ACKNOWLEDGED | ESCALATED | RESOLVED | CLOSED"
        text image_url
        text remarks
        uuid acknowledged_by FK
        timestamptz acknowledged_at
        timestamptz escalated_at
        uuid resolved_by FK
        timestamptz resolved_at
        timestamptz created_at
        timestamptz updated_at
    }

    SETTINGS {
        uuid id PK
        varchar setting_key UK
        text setting_value
        text description
        timestamptz updated_at
    }

    SITES ||--o{ DEPARTMENTS : "contains"
    SITES ||--o{ IOT_DEVICES : "deploys"
    USERS ||--o{ DEPARTMENTS : "supervises"
    USERS ||--o{ EMPLOYEES : "supervises"
    DEPARTMENTS ||--o{ EMPLOYEES : "belongs to"
    DEPARTMENTS ||--o{ IOT_DEVICES : "monitored by"
    EMPLOYEES ||--o{ VIOLATIONS : "incurs"
    VIOLATION_TYPES ||--o{ VIOLATIONS : "categorizes"
    IOT_DEVICES ||--o{ VIOLATIONS : "captures"
    USERS ||--o{ VIOLATIONS : "acknowledges"
    USERS ||--o{ VIOLATIONS : "resolves"
```

---

## 2. Table Specifications

### 1. `users`
Stores user credentials for System Administrators and Supervisors.
- **Constraints**: `email` is UNIQUE, `role IN ('ADMIN', 'SUPERVISOR')`.

### 2. `sites`
Represents physical construction or industrial locations.
- **Columns**: `id`, `site_name`, `location`, `is_active`, `created_at`, `updated_at`.

### 3. `departments`
Sub-units or operational zones within a site.
- **Constraints**: `UNIQUE(site_id, name)`. Foreign keys: `site_id` (RESTRICT), `supervisor_id` (SET NULL).

### 4. `employees`
Field workers assigned to departments.
- **Constraints**: `employee_code` is UNIQUE. Foreign keys: `department_id` (RESTRICT), `supervisor_id` (SET NULL).

### 5. `violation_types`
Catalog of safety rules (e.g., `HELMET_MISSING`, `VEST_MISSING`).
- **Constraints**: `code` is UNIQUE, `severity IN ('LOW', 'MEDIUM', 'HIGH')`.

### 6. `iot_devices`
Hardware cameras or edge sensors.
- **Constraints**: `device_code` is UNIQUE, `status IN ('ONLINE', 'OFFLINE')`.

### 7. `violations`
Transactional log of PPE infractions detected by cameras or logged manually.
- **Constraints**: `status IN ('DETECTED', 'PENDING', 'ACKNOWLEDGED', 'ESCALATED', 'RESOLVED', 'CLOSED')`.

### 8. `settings`
Key-value store for global configurations (e.g., `escalation_time_minutes`, `email_notifications`).
- **Constraints**: `setting_key` is UNIQUE.

---

## 3. Database Indexing Strategy

To maintain sub-millisecond query performance as violation logs scale into millions of records:

| Index Name | Table | Target Columns | Primary Usage |
|---|---|---|---|
| `idx_employee_department` | `employees` | `(department_id)` | Fast lookup of employees by department |
| `idx_employee_supervisor` | `employees` | `(supervisor_id)` | Fast lookup of workers under a supervisor |
| `idx_department_site` | `departments` | `(site_id)` | Site department filtering |
| `idx_violation_employee` | `violations` | `(employee_id)` | Employee violation history |
| `idx_violation_status` | `violations` | `(status)` | Dashboard filtering (`PENDING`, `ESCALATED`) |
| `idx_violation_detected` | `violations` | `(detected_at)` | Time-series charts & background escalation scan |
| `idx_iot_status` | `iot_devices` | `(status)` | Real-time device health monitoring |
