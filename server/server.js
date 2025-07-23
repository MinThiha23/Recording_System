const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// Basic health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Mock API routes for the frontend
app.get('/api/programs', (req, res) => {
  res.json({
    success: true,
    programs: [
      {
        id: 1,
        title: 'Community Development Program',
        status: 'approved',
        budget: 50000,
        createdAt: '2024-01-15'
      },
      {
        id: 2,
        title: 'Education Initiative',
        status: 'pending',
        budget: 35000,
        createdAt: '2024-02-01'
      }
    ]
  });
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});