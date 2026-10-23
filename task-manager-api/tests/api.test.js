import request from 'supertest';
import app from '../server.js';
import { cache } from '../cache.js';

describe('Task Management API Test Suite (Practicals 4, 5, 9, 10, 12, 13)', () => {
  beforeEach(() => {
    // Flush cache before each test for deterministic assertions
    cache.flushAll();
  });

  // 1. Health check test
  test('GET /api/health returns status 200 and operational status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('status', 'OK');
    expect(res.body).toHaveProperty('server', 'Task Manager API');
  });

  // 2. Fetch all tasks test (with caching check)
  test('GET /tasks returns 200 and an array of tasks', async () => {
    const res = await request(app).get('/tasks');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.headers['x-cache-status']).toBe('MISS');

    // Second immediate request should hit cache
    const cachedRes = await request(app).get('/tasks');
    expect(cachedRes.statusCode).toBe(200);
    expect(cachedRes.headers['x-cache-status']).toBe('HIT');
  });

  // 3. Cache statistics endpoint test (Practical 9)
  test('GET /api/cache-stats returns cache hit/miss diagnostic metrics', async () => {
    const res = await request(app).get('/api/cache-stats');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('success', true);
    expect(res.body).toHaveProperty('metrics');
    expect(res.body.metrics).toHaveProperty('hits');
    expect(res.body.metrics).toHaveProperty('misses');
  });

  // 4. Create new task test (Practical 4 & 5 & 10)
  test('POST /tasks creates a new task and returns status 201', async () => {
    const newTaskPayload = {
      title: 'Automated CI Test Task',
      description: 'Testing task creation via Jest Supertest pipeline',
      priority: 'high',
      completed: false,
    };

    const res = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send(newTaskPayload);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('title', 'Automated CI Test Task');
    expect(res.body).toHaveProperty('priority', 'high');
  });

  // 5. Input validation test: Rejects missing title with 400 (Practical 4 & 7)
  test('POST /tasks rejects request with missing title (HTTP 400)', async () => {
    const invalidPayload = {
      description: 'Missing title property',
    };

    const res = await request(app)
      .post('/tasks')
      .set('Content-Type', 'application/json')
      .send(invalidPayload);

    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  // 6. 404 Not Found test for non-existent task ID (Practical 4 & 5)
  test('GET /tasks/:id returns 404 for unknown task ID', async () => {
    const res = await request(app).get('/tasks/9999999999');
    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty('error');
  });

  // 7. AI Assistant Endpoint with Graceful Degradation (Practical 13)
  test('POST /api/ai/generate-description gracefully returns fallback suggestion', async () => {
    const res = await request(app)
      .post('/api/ai/generate-description')
      .set('Content-Type', 'application/json')
      .send({ title: 'Configure Docker and Compose' });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('description');
    expect(typeof res.body.description).toBe('string');
    expect(res.body.description.length).toBeGreaterThan(10);
  });
});
