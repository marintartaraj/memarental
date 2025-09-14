-- Create admin_audit_log table for tracking admin actions
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    action_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for audit log
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_user_id ON admin_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_timestamp ON admin_audit_log(action_timestamp);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_ip ON admin_audit_log(ip_address);

-- Enable RLS
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_audit_log
CREATE POLICY "Admins can view audit logs" ON admin_audit_log
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles ur 
            WHERE ur.user_id = auth.uid() 
            AND ur.role = 'admin' 
            AND ur.is_active = TRUE
        )
    );

CREATE POLICY "System can insert audit logs" ON admin_audit_log
    FOR INSERT WITH CHECK (true);

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_details JSONB DEFAULT '{}',
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO admin_audit_log (
        user_id, 
        action, 
        details, 
        ip_address, 
        user_agent
    ) VALUES (
        p_user_id, 
        p_action, 
        p_details, 
        p_ip_address, 
        p_user_agent
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to get audit logs with pagination
CREATE OR REPLACE FUNCTION get_audit_logs(
    p_limit INTEGER DEFAULT 50,
    p_offset INTEGER DEFAULT 0,
    p_user_id UUID DEFAULT NULL,
    p_action VARCHAR(100) DEFAULT NULL,
    p_start_date TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    p_end_date TIMESTAMP WITH TIME ZONE DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    user_id UUID,
    user_email TEXT,
    action VARCHAR(100),
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    action_timestamp TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        al.id,
        al.user_id,
        au.email as user_email,
        al.action,
        al.details,
        al.ip_address,
        al.user_agent,
        al.action_timestamp
    FROM admin_audit_log al
    JOIN auth.users au ON al.user_id = au.id
    WHERE 
        (p_user_id IS NULL OR al.user_id = p_user_id)
        AND (p_action IS NULL OR al.action ILIKE '%' || p_action || '%')
        AND (p_start_date IS NULL OR al.action_timestamp >= p_start_date)
        AND (p_end_date IS NULL OR al.action_timestamp <= p_end_date)
    ORDER BY al.action_timestamp DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
