-- Migration to remove staff_exco role
-- First, update any existing staff_exco users to admin role
UPDATE users SET role = 'admin' WHERE role = 'staff_exco';

-- Then modify the enum to remove staff_exco
ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user'; 