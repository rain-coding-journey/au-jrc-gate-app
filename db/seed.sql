-- Initial mock data for testing Arellano University JRC security gates
INSERT INTO students (student_id, first_name, last_name, program, year_level, status, has_active_violation)
VALUES 
  ('AU2026-JRC-0123', 'Juan', 'Dela Cruz', 'BS Information Technology', 3, 'ACTIVE', false),
  ('AU2026-JRC-0456', 'Maria', 'Santos', 'BS Nursing', 2, 'ACTIVE', true),
  ('AU2026-JRC-0789', 'Pedro', 'Penduko', 'BS Business Administration', 4, 'SUSPENDED', true)
ON CONFLICT (student_id) DO NOTHING;