const express = require('express');
const path = require('path');
const session = require('express-session'); // ✅ Add this
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());

// ✅ Configure session middleware
app.use(session({
  secret: 'your-secret-key',  // Replace with a secure random string in production
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

// Export the app
module.exports = app;