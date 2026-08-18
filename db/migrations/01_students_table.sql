-- Creates table for student profile records
CREATE TABLE IF NOT EXISTS students (
    student_id VARCHAR(20) PRIMARY KEY, -- e.g., 'AU2026-JRC-0123'
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    program VARCHAR(50) NOT NULL,      -- e.g., 'BSIT', 'BSN', 'BSBA'
    year_level INT NOT NULL CHECK (year_level BETWEEN 1 AND 5),
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'SUSPENDED', 'GRADUATED', 'WITHDRAWN')),
    has_active_violation BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_students_status ON students(status);