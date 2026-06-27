const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('./config/passport');

const authRoutes = require('./routes/auth.routes');
const dashboardRoutes = require('./routes/dashboard.routes');
const paperSearchRoutes = require('./routes/paperSearch.routes');

const app = express();

// Configure CORS to support receiving/sending cookies with credentials
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', 
  credentials: true 
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/papers', paperSearchRoutes);

module.exports = app;