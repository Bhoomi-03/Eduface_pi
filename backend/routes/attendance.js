const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/attendance?date=YYYY-MM-DD
router.get('/', verifyToken, async (req, res) => {
  const date = req.query.date;
  try {
    const [rows] = await pool.query(
      'SELECT a.id, a.student_id, s.name as studentName, s.usn as rollNumber, a.date, a.time, a.status FROM attendance a JOIN students s ON a.student_id=s.id WHERE a.date = ?',
      [date]
    );
    res.json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch attendance' });
  }
});

// POST /api/attendance
// Accept both `studentId` (camelCase) and `student_id` (snake_case) sent by different clients
router.post('/', verifyToken, async (req, res) => {
  // support both names for robustness
  const studentId = req.body.studentId || req.body.student_id;
  const { date, status } = req.body;

  if (!studentId || !date || !status) {
    return res.status(400).json({ message: 'Missing fields (studentId, date, status)'});
  }

  try {
    const [exists] = await pool.query('SELECT id FROM attendance WHERE student_id=? AND date=?', [studentId, date]);
    if (exists.length > 0) return res.status(200).json({ message: 'Already marked' });

    const [result] = await pool.query('INSERT INTO attendance (student_id, date, time, status) VALUES (?, ?, CURTIME(), ?)', [studentId, date, status]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to mark attendance' });
  }
});

module.exports = router;
