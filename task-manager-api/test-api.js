/**
 * Automated Test Script for Practicals 4 & 5
 * Run with: npm test (or node test-api.js) while server is running
 */

const BASE_URL = 'http://localhost:5000';

async function runTests() {
  console.log('==================================================');
  console.log('🧪 Running Automated API Tests (Practicals 4 & 5)');
  console.log('==================================================\n');

  let passed = 0;
  let failed = 0;

  async function testCase(name, fn) {
    try {
      await fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name} -> ${err.message}`);
      failed++;
    }
  }

  // 1. Health Check
  await testCase('GET /api/health (200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/api/health`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (data.status !== 'OK') throw new Error('Response status is not OK');
  });

  // 2. GET All Tasks
  await testCase('GET /tasks (200 OK)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Expected array of tasks');
  });

  // 3. POST Create Task
  let createdId = null;
  await testCase('POST /tasks (201 Created with valid schema)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Study Mongoose Schema Design',
        description: 'Complete Lab Practical 5 requirements',
        priority: 'high',
        completed: false,
      }),
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    const data = await res.json();
    createdId = data._id || data.id;
    if (!createdId) throw new Error('No task ID returned in response');
  });

  // 4. GET Task by ID
  await testCase('GET /tasks/:id (200 OK for existing task)', async () => {
    if (!createdId) throw new Error('No created task ID available');
    const res = await fetch(`${BASE_URL}/tasks/${createdId}`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (data.title !== 'Study Mongoose Schema Design') throw new Error('Task title mismatch');
  });

  // 5. PUT Update Task
  await testCase('PUT /tasks/:id (200 OK update completed state)', async () => {
    if (!createdId) throw new Error('No created task ID available');
    const res = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true }),
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    const data = await res.json();
    if (data.completed !== true) throw new Error('Completed state was not updated');
  });

  // 6. DELETE Task
  await testCase('DELETE /tasks/:id (200 OK delete task)', async () => {
    if (!createdId) throw new Error('No created task ID available');
    const res = await fetch(`${BASE_URL}/tasks/${createdId}`, {
      method: 'DELETE',
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  // 7. Test Missing Content-Type Header (Practical 4 Supplementary)
  await testCase('POST /tasks without Content-Type header (400 Bad Request)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title: 'Invalid header test' }),
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 8. Test Mongoose Schema Validation Failure (Practical 5)
  await testCase('POST /tasks with missing title (400 Validation Error)', async () => {
    const res = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description: 'No title' }),
    });
    if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
  });

  // 9. Test 404 on non-existent task
  await testCase('GET /tasks/999999999999 (404 Not Found)', async () => {
    const res = await fetch(`${BASE_URL}/tasks/999999999999`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
  });

  // 10. Test 404 on undefined route
  await testCase('GET /undefined_route_xyz (404 Not Found)', async () => {
    const res = await fetch(`${BASE_URL}/undefined_route_xyz`);
    if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
  });

  console.log('\n==================================================');
  console.log(`📊 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('==================================================');
}

runTests().catch(console.error);
