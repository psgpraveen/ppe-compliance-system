# PPE Compliance Monitoring System - API Specification

This document provides a comprehensive specification of all REST API endpoints, including required headers, payload schemas, and possible responses.

---

## 1. Global Configurations

### Base URL
```
/api/v1
```

### Authentication Headers
All protected endpoints require the following header:
```http
Authorization: Bearer <jwt_access_token>
```

### Standard Responses

**Success Response (200 OK / 201 Created)**
```json
{
  "success": true,
  "message": "Operation successful.",
  "data": { ... }
}
```

**Paginated Success Response (200 OK)**
```json
{
  "success": true,
  "message": "Data retrieved successfully.",
  "data": [ ... ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}
```

**Validation Error (400 Bad Request)**
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [
    {
      "type": "field",
      "msg": "Valid email is required.",
      "path": "email",
      "location": "body"
    }
  ]
}
```

**Unauthorized Error (401 / 403)**
```json
{
  "success": false,
  "message": "Access denied. Token missing or invalid."
}
```

---

## 2. Authentication Module

### `POST /auth/login`
Authenticates a user and returns an access token.

- **Headers**: `None`
- **Payload**:
```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```
- **Success (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGci...",
    "refreshToken": "def456...",
    "user": {
      "id": "uuid",
      "email": "admin@example.com",
      "role": "ADMIN",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```
- **Error (401 Unauthorized)**: Invalid credentials.

### `POST /auth/forgot-password`
Initiates the password recovery flow.

- **Headers**: `None`
- **Payload**: `{ "email": "user@example.com" }`
- **Success (200 OK)**: `"Password reset link sent to email."`

### `POST /auth/reset-password`
Resets the password using a token.

- **Headers**: `None`
- **Payload**: `{ "token": "abc123token", "newPassword": "newSecurePassword" }`
- **Success (200 OK)**: `"Password has been reset successfully."`

### `PUT /auth/change-password`
Changes the password for a logged-in user.

- **Headers**: `Authorization: Bearer <token>`
- **Payload**: `{ "oldPassword": "currentPassword", "newPassword": "newPassword123" }`
- **Success (200 OK)**: `"Password changed successfully."`
- **Error (400 Bad Request)**: Incorrect old password.

### `GET /auth/me`
Retrieves the logged-in user's profile.

- **Headers**: `Authorization: Bearer <token>`
- **Payload**: `None`
- **Success (200 OK)**: Returns the user object.

---

## 3. Organizations (Departments & Sites)

### `GET /departments` | `GET /sites`
Retrieves a paginated list of departments/sites.

- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `?page=1&limit=10&search=keyword`
- **Success (200 OK)**: Returns Paginated Success Response.

### `POST /departments` | `POST /sites`
Creates a new department or site. (Admin Only)

- **Headers**: `Authorization: Bearer <token>`
- **Payload (Department Example)**:
```json
{
  "departmentName": "Construction Zone A",
  "location": "North Wing",
  "managerName": "Jane Smith"
}
```
- **Success (201 Created)**: Returns the created entity.

### `PUT /departments/:id` | `PUT /sites/:id`
Updates an existing entity.

- **Headers**: `Authorization: Bearer <token>`
- **Payload**: Same as POST, but all fields are optional. Includes `"isActive": boolean`.
- **Success (200 OK)**: Returns the updated entity.

### `DELETE /departments/:id` | `DELETE /sites/:id`
Deletes an entity.

- **Headers**: `Authorization: Bearer <token>`
- **Success (200 OK)**: `"Deleted successfully."`
- **Error (409 Conflict)**: Entity is in use by an employee or device.

---

## 4. Personnel (Employees & Supervisors)

### `GET /employees`
Retrieves a paginated list of employees.

- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `?page=1&limit=10&departmentId=uuid&search=John`
- **Success (200 OK)**: Returns Paginated Success Response.

### `POST /employees`
Creates a new employee record.

- **Headers**: `Authorization: Bearer <token>`
- **Payload**:
```json
{
  "employeeCode": "EMP-001",
  "firstName": "John",
  "lastName": "Doe",
  "departmentId": "uuid",
  "supervisorId": "uuid (optional)",
  "jobProfile": "Welder",
  "mobileNumber": "+1234567890",
  "aadharNumber": "1234-5678-9012"
}
```
- **Success (201 Created)**: Returns created employee.
- **Error (400 Bad Request)**: Employee code already exists.

### `POST /employees/bulk-import`
Imports multiple employees simultaneously.

- **Headers**: `Authorization: Bearer <token>`
- **Payload**: `[ { ...employeeData } ]` (Array of employee objects)
- **Success (201 Created)**: 
```json
{
  "success": true,
  "data": {
    "imported": 50,
    "failed": 2
  }
}
```

---

## 5. Violations & IoT Detection

### `GET /violations`
Retrieves a paginated list of PPE violations. Supervisors only see violations in their departments.

- **Headers**: `Authorization: Bearer <token>`
- **Query Params**: `?page=1&limit=10&status=PENDING&departmentId=uuid`
- **Success (200 OK)**: Returns Paginated Success Response.

### `POST /iot/violations`
Webhook endpoint for IoT cameras to report a detected violation.

- **Headers**: `x-api-key: <device_secret_key>`
- **Payload**:
```json
{
  "employeeCode": "EMP-001",
  "violationTypeCode": "HELMET_MISSING",
  "imageUrl": "https://s3.bucket.com/evidence.jpg"
}
```
- **Success (201 Created)**: Creates the violation with status `PENDING` and alerts the dashboard.

### `PUT /violations/:id/acknowledge`
Supervisor acknowledges a pending violation.

- **Headers**: `Authorization: Bearer <token>`
- **Payload**: `None`
- **Success (200 OK)**: Updates status to `ACKNOWLEDGED`.

### `PUT /violations/:id/resolve`
Admin or Supervisor resolves a violation.

- **Headers**: `Authorization: Bearer <token>`
- **Payload**: `{ "resolutionNotes": "Worker was provided a new helmet." }`
- **Success (200 OK)**: Updates status to `RESOLVED`.

---

## 6. Dashboard & Settings

### `GET /dashboard/stats`
Retrieves real-time analytics for the dashboard view.

- **Headers**: `Authorization: Bearer <token>`
- **Success (200 OK)**:
```json
{
  "success": true,
  "data": {
    "totalViolations": 1205,
    "activeAlerts": 15,
    "resolvedToday": 8,
    "escalatedCases": 2,
    "complianceRate": 94.5
  }
}
```

### `GET /settings`
Retrieves global system configurations.

- **Headers**: `Authorization: Bearer <token>`
- **Success (200 OK)**:
```json
{
  "success": true,
  "data": {
    "escalation_time_minutes": "30",
    "email_notifications": "true",
    "admin_escalation_notification": "true"
  }
}
```

### `PUT /settings`
Updates global system configurations (Admin Only).

- **Headers**: `Authorization: Bearer <token>`
- **Payload**: Key-value pairs of settings to update.
- **Success (200 OK)**: Returns updated settings list.