-- Migration: Add 'query_answered' status to programs table
-- Date: 2025-06-25
-- Description: Adds the new 'query_answered' status to the programs table status enum

-- First, create a temporary table with the new enum values
CREATE TABLE programs_temp LIKE programs;

-- Update the status column in the temporary table to include 'query_answered'
ALTER TABLE programs_temp MODIFY COLUMN status ENUM('draft', 'under_review', 'completed', 'rejected', 'query', 'query_answered') DEFAULT NULL;

-- Copy all data from the original table to the temporary table
INSERT INTO programs_temp SELECT * FROM programs;

-- Drop the original table
DROP TABLE programs;

-- Rename the temporary table to the original name
RENAME TABLE programs_temp TO programs;

-- Recreate the foreign key constraints
ALTER TABLE programs 
ADD CONSTRAINT programs_ibfk_1 FOREIGN KEY (created_by) REFERENCES users (id),
ADD CONSTRAINT programs_ibfk_2 FOREIGN KEY (updated_by) REFERENCES users (id);

-- Add indexes back
ALTER TABLE programs 
ADD KEY created_by (created_by),
ADD KEY updated_by (updated_by);

-- Verify the change
SELECT COLUMN_NAME, COLUMN_TYPE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'recording_system' 
AND TABLE_NAME = 'programs' 
AND COLUMN_NAME = 'status'; 