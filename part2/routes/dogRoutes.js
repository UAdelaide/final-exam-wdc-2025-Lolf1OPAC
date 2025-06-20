const express = require('express');
const router = express.Router();
const db = require('../models/db');

// GET dogs owned by current logged-in owner
router.get('/mydogs', async (req, res) => {
  try {
    const ownerId = req.session.user.user_id;
    const [dogs] = await db.query(`
      SELECT dog_id, name, size FROM Dogs WHERE owner_id = ?
    `, [ownerId]);
    res.json(dogs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

module.exports = router;