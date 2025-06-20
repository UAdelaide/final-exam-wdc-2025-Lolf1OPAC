const express = require('express');
const path = require('path');
const session = require('express-session');
require('dotenv').config();

const app = express();

app.use(express.json());

// ✅ configure session
app.use(session({
  secret: 'jesusisking', // encrypts the cookie's session ID that the browsers sends with each request
  resave: false, // do not save session if it was never modified
  cookie: {
    httpOnly: true, // cookie cant be tampered with by client-side js
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

app.use(express.static(path.join(__dirname, '/public')));

// Routes
const walkRoutes = require('./routes/walkRoutes');
const userRoutes = require('./routes/userRoutes');

app.use('/api/walks', walkRoutes);
app.use('/api/users', userRoutes);

module.exports = app;