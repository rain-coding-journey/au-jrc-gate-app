-- Tracks student disciplinary actions and policy violations
CREATE TABLE IF NOT EXISTS violations (
    violation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(20) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL, -- e.g., 'NO_UNIFORM', 'NO_ID', 'SUSPENDED_ENTRY'
    description TEXT,
    severity VARCHAR(10) NOT NULL CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
    is_resolved BOOLEAN NOT NULL DEFAULT FALSE,
    logged_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_violations_student_active ON violations(student_id) WHERE is_resolved = FALSE;