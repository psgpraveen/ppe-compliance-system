# UI Pages & Wireframes

This document describes all frontend pages, their layout structure, and key interactive elements.

---

## Public Pages (Unauthenticated)

### 1. Login (`/login`)
- Email and password input fields with validation.
- "Forgot Password?" link navigates to `/forgot-password`.
- "Forgot Password?" link navigates to `/forgot-password`.
- On success: redirect to `/dashboard`.

### 2. Forgot Password (`/forgot-password`)
- Email input field.
- Sends a password reset link to the user's email via Gmail SMTP.

### 3. Reset Password (`/reset-password`)
- Token-based form accessed via email link.
- New password + confirm password fields.
- On success: redirect to `/login`.

---

## Authenticated Pages (Dashboard Shell)

All authenticated pages share a common layout:
- **Sidebar**: Collapsible navigation with links to all modules.
- **Header Bar**: User profile, role badge, and logout button.
- **Main Content Area**: Page-specific content rendered below.

---

### 4. Dashboard Home (`/dashboard`)
- **Summary Stat Cards**: Total Violations, Active Alerts, Escalated Cases, Resolved Today, Compliance Rate.
- **Violations Trend Chart**: Line chart showing daily violation counts over time (Recharts).
- **Recent Violations Table**: Last 5–10 violations with employee name, type, status, and timestamp.

### 5. Sites Management (`/dashboard/sites`)
- **Data Table**: Paginated list of construction sites with name, location, status, and action buttons.
- **Create/Edit Modal**: Form with site name, location, and active toggle.
- **Search & Pagination**: Top search bar and bottom pagination controls.

### 6. Departments Management (`/dashboard/departments`)
- **Data Table**: Paginated list with department name, assigned site, supervisor, and action buttons.
- **Create/Edit Modal**: Form with department name, site dropdown (CustomSelect), and supervisor dropdown.
- **Search & Pagination**: Top search bar and bottom pagination controls.

### 7. Supervisors Management (`/dashboard/supervisors`)
- **Data Table**: Paginated list with supervisor name, email, status, and action buttons.
- **Create/Edit Modal**: Form with first name, last name, email, password, and active toggle.
- **Search & Pagination**: Top search bar and bottom pagination controls.

### 8. Employees Management (`/dashboard/employees`)
- **Data Table**: Paginated list with employee code, name, department, supervisor, job profile, and action buttons.
- **Create/Edit Modal**: Form with employee code, first name, last name, department dropdown, supervisor dropdown, job profile, mobile, and Aadhar number.
- **Bulk Import**: CSV file upload supporting batch employee creation.
- **Search & Pagination**: Top search bar and bottom pagination controls.

### 9. Violation Types (`/dashboard/violation-types`)
- **Data Table**: Paginated list with code, name, severity badge (LOW/MEDIUM/HIGH), status, and action buttons.
- **Create/Edit Modal**: Form with code, name, severity dropdown, and active toggle.

### 10. Violations Log (`/dashboard/violations`)
- **Data Table**: Paginated list with employee, violation type, severity, status badge, detected time, and action buttons.
- **Status Badges**: Color-coded (PENDING = yellow, ACKNOWLEDGED = blue, ESCALATED = red, RESOLVED = green).
- **Action Buttons**: "Acknowledge" and "Resolve" buttons contextually available based on current status.
- **Filters**: Department, status, and date range filters.

### 11. Analytics (`/dashboard/analytics`)
- **Compliance Trend Charts**: Time-series visualizations of violations over configurable date ranges.
- **Department-wise Breakdown**: Bar or pie charts showing violation distribution by department.

### 12. IoT Simulator (`/dashboard/iot-simulator`)
- **Test Bench**: Form to simulate an IoT camera payload submission.
- **Fields**: Employee Code dropdown, Violation Type dropdown, Image URL input.
- **Submit**: Fires a `POST /api/v1/iot/violations` to create a real violation record for testing.

### 13. Settings (`/dashboard/settings`)
- **Escalation Policy Card**: CustomSelect dropdown for supervisor action timeout (5 min – 4 hours).
- **Notification Toggles**: Toggle switches for Admin Escalation Alerts and Email Notifications.
- **Save Button**: Persists settings to the database via `PUT /api/v1/settings`.
