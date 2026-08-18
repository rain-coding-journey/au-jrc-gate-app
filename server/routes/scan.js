const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const { authorizeRole } = require('../middleware/auth');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

/**
 * POST /api/v1/scan/verify
 * Scans QR Code and evaluates student entry permission
 */
router.post('/verify', authorizeRole(['GUARD', 'ADMIN']), async (req, res) => {
  const { student_id, gate_location, scanned_at } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Fetch minimal student data (Data Minimization)
    const studentRes = await client.query(
      'SELECT student_id, first_name, last_name, program, status, has_active_violation FROM students WHERE student_id = $1',
      [student_id]
    );

    if (studentRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ status: 'ERROR', message: 'Student ID not recognized' });
    }

    const student = studentRes.rows[0];
    const isAllowed = student.status === 'ACTIVE' && !student.has_active_violation;
    const entryStatus = isAllowed ? 'ALLOWED' : 'DENIED';

    // Log entry event into database
    await client.query(
      `INSERT INTO entry_logs (student_id, officer_id, gate_location, entry_status, scanned_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [student_id, req.user.user_id, gate_location, entryStatus, scanned_at || new Date().toISOString()]
    );

    // Audit logging for security compliance
    await client.query(
      `INSERT INTO security_audit_logs (user_id, action, details, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [req.user.user_id, 'VERIFY_STUDENT', JSON.stringify({ student_id, entryStatus, gate_location }), req.ip]
    );

    await client.query('COMMIT');

    return res.json({
      status: 'SUCCESS',
      access: entryStatus,
      student: {
        student_id: student.student_id,
        full_name: `${student.first_name} ${student.last_name}`,
        program: student.program,
        status: student.status
      }
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Scan evaluation error:', err);
    return res.status(500).json({ error: 'Internal server error processing scan' });
  } finally {
    client.release();
  }
});

/**
 * POST /api/v1/scan/sync
 * Bulk synchronizes offline scans recorded during internet outages
 */
router.post('/sync', authorizeRole(['GUARD', 'ADMIN']), async (req, res) => {
  const { device_id, logs } = req.body;

  if (!Array.isArray(logs) || logs.length === 0) {
    return res.status(400).json({ error: 'Invalid or empty logs array' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    for (const log of logs) {
      await client.query(
        `INSERT INTO entry_logs (student_id, officer_id, gate_location, entry_status, scanned_at, is_offline_sync)
         VALUES ($1, $2, $3, $4, $5, TRUE)`,
        [log.student_id, req.user.user_id, log.gate_location, log.entry_status || 'ALLOWED', log.scanned_at]
      );
    }

    await client.query(
      `INSERT INTO security_audit_logs (user_id, action, details, ip_address)
       VALUES ($1, $2, $3, $4)`,
      [req.user.user_id, 'SYNC_OFFLINE_BATCH', JSON.stringify({ device_id, log_count: logs.length }), req.ip]
    );

    await client.query('COMMIT');
    return res.json({ status: 'SUCCESS', synced_count: logs.length });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Batch sync error:', err);
    return res.status(500).json({ error: 'Failed to process offline batch' });
  } finally {
    client.release();
  }
});

module.exports = router;