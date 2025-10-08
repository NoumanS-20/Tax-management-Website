const request = require('supertest');
const app = require('../app');

describe('Health Check Endpoint', () => {
  it('should return health status', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.message).toContain('FinStack India API is running');
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
});
