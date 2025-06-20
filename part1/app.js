const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 8080;

// Create a pool for MySQL
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'DogWalkService'
});

// Insert test data on server start
async function seedData() {
  try {
    const conn = await pool.getConnection();

    // Insert users
    await conn.query(`
      INSERT IGNORE INTO Users (username, email, password_hash, role)
      VALUES
      ('alice123', 'alice@example.com', 'hashed123', 'owner'),
      ('bobwalker', 'bob@example.com', 'hashed456', 'walker'),
      ('carol123', 'carol@example.com', 'hashed789', 'owner'),
      ('davidwalker', 'david@example.com', 'hashed101', 'walker'),
      ('emilyowner', 'emily@example.com', 'hashed102', 'owner');
    `);

    // Insert dogs
    await conn.query(`
      INSERT IGNORE INTO Dogs (owner_id, name, size)
      SELECT user_id, 'Max', 'medium' FROM Users WHERE username = 'alice123'
      UNION
      SELECT user_id, 'Bella', 'small' FROM Users WHERE username = 'carol123'
      UNION
      SELECT user_id, 'Rocky', 'large' FROM Users WHERE username = 'emilyowner'
      UNION
      SELECT user_id, 'Luna', 'small' FROM Users WHERE username = 'alice123'
      UNION
      SELECT user_id, 'Charlie', 'medium' FROM Users WHERE username = 'carol123';
    `);

    // Insert walk requests
    await conn.query(`
      INSERT IGNORE INTO WalkRequests (dog_id, requested_time, duration_minutes, location, status)
      SELECT dog_id, '2025-06-10 08:00:00', 30, 'Parklands', 'open' FROM Dogs WHERE name = 'Max'
      UNION
      SELECT dog_id, '2025-06-10 09:30:00', 45, 'Beachside Ave', 'accepted' FROM Dogs WHERE name = 'Bella'
      UNION
      SELECT dog_id, '2025-06-11 07:00:00', 60, 'River Trail', 'open' FROM Dogs WHERE name = 'Rocky'
      UNION
      SELECT dog_id, '2025-06-11 10:00:00', 30, 'Central Park', 'open' FROM Dogs WHERE name = 'Luna'
      UNION
      SELECT dog_id, '2025-06-12 08:30:00', 40, 'Sunset Blvd', 'cancelled' FROM Dogs WHERE name = 'Charlie';
    `);

    conn.release();
    console.log("Seed data inserted.");
  } catch (err) {
    console.error("Error inserting seed data:", err);
  }
}

// Route: /api/dogs
app.get('/api/dogs', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT d.name AS dog_name, d.size, u.username AS owner_username
      FROM Dogs d
      JOIN Users u ON d.owner_id = u.user_id;
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch dogs' });
  }
});

// Route: /api/walkrequests/open
app.get('/api/walkrequests/open', async (req, res) => {
  try {
    const [rows] = await pool.query(`
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

// Route: /api/walkers/summary
app.get('/api/walkers/summary', async (req, res) => {
  try {
    const [rows] = await pool.query(`
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

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}`);
  await seedData(); // Insert test data
});