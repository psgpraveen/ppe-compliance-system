-- ===========================================
-- PPE Compliance Monitoring System
-- PostgreSQL Schema
-- ===========================================

-- UUID Extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- USERS (Admins & Supervisors)
-- ===========================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,

    role VARCHAR(20) NOT NULL
        CHECK (role IN ('ADMIN', 'SUPERVISOR')),

    is_active BOOLEAN DEFAULT TRUE,

    last_login TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- SITES
-- ===========================================

CREATE TABLE sites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_name VARCHAR(150) NOT NULL,
    location TEXT,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- DEPARTMENTS
-- ===========================================

CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    site_id UUID NOT NULL
        REFERENCES sites(id)
        ON DELETE RESTRICT,

    supervisor_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    name VARCHAR(100) NOT NULL,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(site_id, name)
);

-- ===========================================
-- EMPLOYEES
-- ===========================================

CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    employee_code VARCHAR(30) UNIQUE NOT NULL,

    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,

    department_id UUID NOT NULL
        REFERENCES departments(id)
        ON DELETE RESTRICT,

    supervisor_id UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    job_profile VARCHAR(100),
    mobile_number VARCHAR(20),
    aadhar_number VARCHAR(20),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- VIOLATION TYPES
-- ===========================================

CREATE TABLE violation_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    code VARCHAR(50) UNIQUE NOT NULL,

    name VARCHAR(100) NOT NULL,

    severity VARCHAR(20)
        CHECK (severity IN ('LOW','MEDIUM','HIGH')),

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- IOT DEVICES
-- ===========================================

CREATE TABLE iot_devices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    device_code VARCHAR(50) UNIQUE NOT NULL,

    device_name VARCHAR(150),

    serial_number VARCHAR(100),

    site_id UUID
        REFERENCES sites(id)
        ON DELETE SET NULL,

    department_id UUID
        REFERENCES departments(id)
        ON DELETE SET NULL,

    firmware_version VARCHAR(50),

    status VARCHAR(20)
        CHECK(status IN ('ONLINE','OFFLINE')),

    last_heartbeat TIMESTAMPTZ,

    is_active BOOLEAN DEFAULT TRUE,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- VIOLATIONS
-- ===========================================

CREATE TABLE violations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    employee_id UUID NOT NULL
        REFERENCES employees(id)
        ON DELETE RESTRICT,

    violation_type_id UUID NOT NULL
        REFERENCES violation_types(id)
        ON DELETE RESTRICT,

    iot_device_id UUID
        REFERENCES iot_devices(id)
        ON DELETE SET NULL,

    detected_at TIMESTAMPTZ NOT NULL,

    status VARCHAR(20)
        CHECK (
            status IN (
                'DETECTED',
                'PENDING',
                'ACKNOWLEDGED',
                'ESCALATED',
                'RESOLVED',
                'CLOSED'
            )
        ),

    image_url TEXT,

    remarks TEXT,

    acknowledged_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    acknowledged_at TIMESTAMPTZ,

    escalated_at TIMESTAMPTZ,

    resolved_by UUID
        REFERENCES users(id)
        ON DELETE SET NULL,

    resolved_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- SETTINGS
-- ===========================================

CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    setting_key VARCHAR(100) UNIQUE NOT NULL,

    setting_value TEXT NOT NULL,

    description TEXT,

    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- ===========================================
-- DEFAULT SETTINGS
-- ===========================================

INSERT INTO settings (setting_key, setting_value, description)
VALUES
('escalation_time_minutes','10','Minutes before escalation'),
('email_notifications','true','Enable email notifications'),
('sms_notifications','false','Enable SMS notifications')
ON CONFLICT (setting_key) DO NOTHING;

-- ===========================================
-- DEFAULT VIOLATION TYPES
-- ===========================================

INSERT INTO violation_types(code,name,severity)
VALUES
('HELMET_MISSING','Helmet Missing','HIGH'),
('VEST_MISSING','Safety Vest Missing','HIGH'),
('GLOVES_MISSING','Gloves Missing','MEDIUM'),
('SHOES_MISSING','Safety Shoes Missing','HIGH'),
('GOGGLES_MISSING','Safety Goggles Missing','MEDIUM'),
('MASK_MISSING','Face Mask Missing','LOW'),
('EAR_PROTECTION_MISSING','Ear Protection Missing','LOW')
ON CONFLICT (code) DO NOTHING;

-- ===========================================
-- INDEXES
-- ===========================================

CREATE INDEX idx_employee_department
ON employees(department_id);

CREATE INDEX idx_employee_supervisor
ON employees(supervisor_id);

CREATE INDEX idx_department_site
ON departments(site_id);

CREATE INDEX idx_violation_employee
ON violations(employee_id);

CREATE INDEX idx_violation_status
ON violations(status);

CREATE INDEX idx_violation_detected
ON violations(detected_at);

CREATE INDEX idx_iot_status
ON iot_devices(status);