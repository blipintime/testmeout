import express from 'express'
import request from 'supertest'


// Create Express app
const app = express();
app.use(express.json());

// Sample data
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
];

// Endpoints
app.get('/api/users', (req, res) => {
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name,
    email: req.body.email
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

// Tests
describe('User API Endpoints', () => {
  // Test GET /api/users
  test('GET /api/users should return all users', async () => {
    const response = await request(app).get('/api/users');
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('id');
    expect(response.body[0]).toHaveProperty('name');
    expect(response.body[0]).toHaveProperty('email');
  });

  // Test GET /api/users/:id
  test('GET /api/users/:id should return a specific user', async () => {
    const response = await request(app).get('/api/users/1');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', 1);
    expect(response.body).toHaveProperty('name', 'John Doe');
    expect(response.body).toHaveProperty('email', 'john@example.com');
  });

  test('GET /api/users/:id should return 404 for non-existent user', async () => {
    const response = await request(app).get('/api/users/999');
    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('message', 'User not found');
  });

  // Test POST /api/users
  test('POST /api/users should create a new user', async () => {
    const newUser = {
      name: 'Bob Johnson',
      email: 'bob@example.com'
    };
    
    const response = await request(app)
      .post('/api/users')
      .send(newUser);
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name', 'Bob Johnson');
    expect(response.body).toHaveProperty('email', 'bob@example.com');
    
    // Verify user was added to the array
    const usersResponse = await request(app).get('/api/users');
    expect(usersResponse.body).toContainEqual(
      expect.objectContaining(newUser)
    );
  });

  // Test invalid POST data
  test('POST /api/users should return 400 for invalid data', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: '' }); // Missing email
    
    expect(response.status).toBe(400);
  });
});

// Setup and teardown
beforeEach(() => {
  // Reset users array before each test
  users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
});
