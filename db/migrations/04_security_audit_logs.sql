-- Immutable system audit trail for DPA compliance and guard accountability
CREATE TABLE IF NOT EXISTS security_audit_logs (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    action VARCHAR(50) NOT NULL, -- e.g., 'VERIFY_STUDENT', 'SYNC_OFFLINE_BATCH', 'EXPORT_LOGS'
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_user_action ON security_audit_logs(user_id, action);