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
    const [rows] = await poolQ.query(`
      SELECT doggy.name AS dog_name, doggy.size, user.username AS owner_username
      FROM Dogs doggy
      JOIN Users user ON doggy.owner_id = user.user_id;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// /api/walkrequests/open
app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await poolQ.query(`
      SELECT w.request_id, d.name AS dog_name, w.requested_time, w.duration_minutes, w.location, u.username AS owner_username
      FROM WalkRequests w
      JOIN Dogs d ON w.dog_id = d.dog_id
      JOIN Users u ON d.owner_id = u.user_id
      WHERE w.status = 'open';
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch open walk requests' });
  }
});

// /api/walkers/summary
app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await poolQ.query(`
      SELECT
        u.username AS walker_username,
        COUNT(r.rating_id) AS total_ratings,
        ROUND(AVG(r.rating), 1) AS average_rating,
        COUNT(CASE WHEN w.status = 'completed' THEN 1 END) AS completed_walks
      FROM Users u
      LEFT JOIN WalkApplications a ON u.user_id = a.walker_id AND a.status = 'accepted'
      LEFT JOIN WalkRequests w ON a.request_id = w.request_id
      LEFT JOIN WalkRatings r ON u.user_id = r.walker_id
      WHERE u.role = 'walker'
      GROUP BY u.user_id;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch walker summary' });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
