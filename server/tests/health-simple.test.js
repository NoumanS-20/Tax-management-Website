const request = require('supertest');

// Mock the app without database connection
const express = require('express');
const cors = require('cors');

const app = express();

// Basic middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'SwiftTax API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

describe('Health Check Endpoint (No Database)', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('SwiftTax API is running');
    expect(response.body.timestamp).toBeDefined();
  });

  it('should return valid timestamp', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    const timestamp = new Date(response.body.timestamp);
    expect(timestamp).toBeInstanceOf(Date);
    expect(timestamp.getTime()).not.toBeNaN();
  });

  it('should handle 404 routes', async () => {
    const response = await request(app)
      .get('/api/nonexistent')
      .expect(404);

    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Route not found');
  });
});
