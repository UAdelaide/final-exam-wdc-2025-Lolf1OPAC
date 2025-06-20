const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 8080;

const poolQ = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DogWalkService'
});

// /api/dogs
app.get('/api/dogs', async (req, res) => {
  try {
    const [dogs] = await poolQ.query(`
      SELECT doggy.name AS dog_name, doggy.size, user.username AS owner_username
      FROM Dogs doggy
      JOIN Users user ON doggy.owner_id = user.user_id;
    `);
    res.json(dogs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// /api/walkrequests/open
app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [req] = await poolQ.query(`
      SELECT wReq.request_id, doggy.name AS dog_name, wReq.requested_time, wReq.duration_minutes, wReq.location, user.username AS owner_username
      FROM WalkRequests wReq
      JOIN Dogs doggy ON wReq.dog_id = doggy.dog_id
      JOIN Users user ON doggy.owner_id = user.user_id
      WHERE wReq.status = 'open';
    `);
    res.json(req);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch openwalk requests' });
  }
});

// /api/walkers/summary
app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await poolQ.query(`
      SELECT
        user.username AS walker_username,
        COUNT(rating.rating_id) AS total_ratings,
        ROUND(AVG(rating.rating), 1) AS average_rating,
        COUNT(CASE WHEN wReq.status = 'completed' THEN 1 END) AS completed_walks
      FROM Users user
      LEFT JOIN WalkApplications app ON user.user_id = app.walker_id AND app.status = 'accepted'
      LEFT JOIN WalkRequests wReq ON app.request_id = wReq.request_id
      LEFT JOIN WalkRatings rating ON user.user_id = rating.walker_id
      WHERE user.role = 'walker'
      GROUP BY user.user_id;
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch walker summary' });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});