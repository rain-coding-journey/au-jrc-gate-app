-- Stores gate scanning and entry access logs
CREATE TABLE IF NOT EXISTS entry_logs (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id VARCHAR(20) NOT NULL REFERENCES students(student_id) ON DELETE CASCADE,
    officer_id UUID NOT NULL,
    gate_location VARCHAR(50) NOT NULL, -- e.g., 'Gov. Pascual Ave Gate 1'
    entry_status VARCHAR(20) NOT NULL CHECK (entry_status IN ('ALLOWED', 'DENIED', 'FLAGGED')),
    scanned_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_offline_sync BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_entry_logs_student ON entry_logs(student_id);
CREATE INDEX idx_entry_logs_scanned_at ON entry_logs(scanned_at DESC);