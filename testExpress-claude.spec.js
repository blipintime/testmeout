// test/api.test.js
import express from 'express'
import request from 'supertest'

const app = express();

// Mock endpoint for testing
app.get('/api/users', (req, res) => {
  res.status(200).json({
    users: [
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' },
      { id: 3, name: 'Charlie' }
    ]
  });
});

app.post('/api/users', express.json(), (req, res) => {
  // Simple validation
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name is required' });
  }
  
  // Mock successful creation
  res.status(201).json({
    id: 4,
    name: req.body.name
  });
});

describe('API Endpoints', () => {
  // GET endpoint test
  describe('GET /api/users', () => {
    it('should return all users', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect('Content-Type', /json/)
        .expect(200);
      
      expect(res.body.users).toBeInstanceOf(Array);
      expect(res.body.users).toHaveLength(3);
      expect(res.body.users[0]).toHaveProperty('id');
      expect(res.body.users[0]).toHaveProperty('name');
    });
  });
  
  // POST endpoint tests
  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const userData = { name: 'Dave' };
      
      const res = await request(app)
        .post('/api/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(201);
      
      expect(res.body).toHaveProperty('id');
      expect(res.body.name).toBe('Dave');
    });
    
    it('should return 400 if name is missing', async () => {
      const userData = { email: 'test@example.com' };
      
      const res = await request(app)
        .post('/api/users')
        .send(userData)
        .expect('Content-Type', /json/)
        .expect(400);
      
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toBe('Name is required');
    });
  });
});

// To run these tests in a real project:
// 1. Create a separate file for your app setup
// 2. Export the app from that file
// 3. Import it in your test file instead of defining it inline
// 4. Run with: npx jest api.test.js