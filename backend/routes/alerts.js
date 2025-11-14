const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/alerts - return list of unauthorized snapshots from folder
router.get('/', verifyToken, async (req, res) => {
  if (!req.user || req.user.role !== 'security') return res.status(403).json({ message: 'Forbidden' });

  const dir = path.join(__dirname, '..', '..', 'unauthorized_logs');
  try {
    if (!fs.existsSync(dir)) return res.json([]);
    const files = fs.readdirSync(dir).filter((f) => f.toLowerCase().endsWith('.jpg') || f.toLowerCase().endsWith('.png'));
    const list = files.map((f) => {
      const stat = fs.statSync(path.join(dir, f));
      return { file: f, time: stat.mtime, path: `/unauthorized_logs/${f}` };
    });
    res.json(list.sort((a, b) => b.time - a.time));
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to read alerts' });
  }
});

module.exports = router;
