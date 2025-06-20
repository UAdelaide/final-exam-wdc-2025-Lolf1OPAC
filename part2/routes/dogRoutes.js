const express = require('express');
const router = express.Router();
const db = require('../models/db');

// get dogs owned by current logged-in owner, must be in the database entry
router.get('/mydogs', async (req, res) => {
  try {
    const ownerId = req.session.user.user_id;
    // match the owner id with the matching dog ids in the data
    const [dogs] = await db.query(`
      SELECT dog_id, name, size FROM Dogs WHERE owner_id = ?
    `, [ownerId]);
    res.json(dogs);
  } catch (error) {
    res.status(500).json({ error: 'dog fetch failed' });
  }
});

module.exports = router;