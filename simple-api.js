const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Indigenous Platform API', timestamp: new Date() });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  // Mock authentication
  res.json({
    success: true,
    user: {
      id: '123',
      email: email,
      name: 'Test User',
      role: 'SUPPLIER'
    },
    token: 'mock-jwt-token'
  });
});

app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration successful'
  });
});

app.get('/api/auth/me', (req, res) => {
  res.json({
    user: {
      id: '123',
      email: 'test@indigenious.ca',
      name: 'Test User',
      role: 'SUPPLIER'
    }
  });
});

// Business endpoints
app.get('/api/businesses', (req, res) => {
  res.json({
    businesses: [
      { id: '1', name: 'Eagle Construction', verified: true },
      { id: '2', name: 'Bear Services', verified: true }
    ]
  });
});

// RFQ endpoints
app.get('/api/rfqs', (req, res) => {
  res.json({
    rfqs: [
      { id: '1', title: 'Construction Project', status: 'OPEN', budget: 50000 },
      { id: '2', title: 'IT Services', status: 'OPEN', budget: 25000 }
    ]
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('✓ API Server running on http://localhost:' + PORT);
});