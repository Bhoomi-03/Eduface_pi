const express = require('express');
const { verifyToken } = require('../middleware/auth');
const { spawn } = require('child_process');
const path = require('path');

const router = express.Router();

// POST /api/door/open { action: 'open' | 'close' }
router.post('/open', verifyToken, async (req, res) => {
  const { action } = req.body;
  // Only allow security role to trigger
  if (!req.user || req.user.role !== 'security') return res.status(403).json({ message: 'Forbidden' });

  // Call the Python motor script asynchronously (ensure path is correct)
  const script = path.join(__dirname, '..', '..', 'motor_test_safe.py');
  const py = spawn('python3', [script, action || 'open']);

  let output = '';
  py.stdout.on('data', (data) => (output += data.toString()));
  py.stderr.on('data', (data) => (output += data.toString()));

  py.on('close', (code) => {
    return res.json({ status: action === 'open' ? 'opened' : 'closed', code, output });
  });
});

module.exports = router;
