const express = require('express');
const pool = require('../db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Ensure students table exists - schema based on your current DB
(async () => {
  const create = `
    CREATE TABLE IF NOT EXISTS students (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100),
      usn VARCHAR(30) UNIQUE,
      parent_number VARCHAR(20),
      section VARCHAR(20),
      department VARCHAR(50),
      sem VARCHAR(10),
      dataset_folder VARCHAR(200)
    ) ENGINE=InnoDB;
  `;
  await pool.query(create);
})();

// GET /api/students
router.get('/', verifyToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, name, usn, parent_number, section, department, sem FROM students');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch students' });
  }
});

// POST /api/students
router.post('/', verifyToken, async (req, res) => {
  const { name, usn, parent_number, section, department, sem, dataset_folder } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO students (name, usn, parent_number, section, department, sem, dataset_folder) VALUES (?, ?, ?, ?, ?, ?, ?)', [name, usn, parent_number, section, department, sem, dataset_folder]);
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to add student' });
  }
});

// PUT /api/students/:id
router.put('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { name, usn, parent_number, section, department, sem } = req.body;
  try {
    await pool.query('UPDATE students SET name=?, usn=?, parent_number=?, section=?, department=?, sem=? WHERE id=?', [name, usn, parent_number, section, department, sem, id]);
    res.json({ message: 'Updated' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update student' });
  }
});

// DELETE /api/students/:id
router.delete('/:id', verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM students WHERE id=?', [id]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete student' });
  }
});

module.exports = router;
