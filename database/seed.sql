-- database/seed.sql
-- Default seed data for PPE Compliance Monitoring System

-- Extension for password hashing if needed, though we will supply pre-hashed values from backend tools normally.
-- Here is a pre-hashed bcrypt password for 'Admin@123' (Cost factor 10)
-- $2b$10$wB5Wp29UqOOH2vP5G8sBveG9bS35f21Q8jYI9F2BvS./4r2T.L/K2

INSERT INTO users (first_name, last_name, email, password_hash, role, is_active) 
VALUES (
    'System', 
    'Admin', 
    'admin@example.com', 
    '$2b$10$wB5Wp29UqOOH2vP5G8sBveG9bS35f21Q8jYI9F2BvS./4r2T.L/K2', 
    'ADMIN', 
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert default site for departments since site_id is required
INSERT INTO sites (site_name, location)
VALUES ('Main Construction Site', 'HQ')
ON CONFLICT DO NOTHING;
