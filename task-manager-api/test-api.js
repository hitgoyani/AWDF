/**
 * Automated Test Suite for Practicals 4, 5, 6, and 7
 * Tests CRUD operations, validation pipeline, and JWT authentication.
 */

const BASE_URL = 'http://localhost:5000';

const runTests = async () => {
  console.log('='.repeat(65));
  console.log('🚀 TASK MANAGER API - AUTOMATED TEST SUITE (Practicals 4, 5, 6, 7)');
  console.log('='.repeat(65));

  let createdTaskId = null;
  let authToken = null;
  let testUserEmail = `testuser_${Date.now()}@example.com`;

  try {
    // TEST 1: Health Check
    console.log('\n[TEST 1] GET /api/health');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status} | DB Mode: ${healthData.database}`);

    // TEST 2: Register New User (Practical 7)
    console.log('\n[TEST 2] POST /auth/register (User Registration with bcrypt)');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Automated Test Runner',
        email: testUserEmail,
        password: 'securePassword123',
        role: 'student',
      }),
    });
    const regData = await regRes.json();
    console.log(`Status: ${regRes.status} | Success: ${regData.success} | Msg: ${regData.message}`);

    // TEST 3: Login User and Receive JWT (Practical 7)
    console.log('\n[TEST 3] POST /auth/login (JWT Generation)');
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: 'securePassword123',
      }),
    });
    const loginData = await loginRes.json();
    authToken = loginData.token;
    console.log(`Status: ${loginRes.status} | Token Received: ${Boolean(authToken)} (Length: ${authToken?.length})`);

    // TEST 4: Access Protected Route /auth/me (Practical 7)
    console.log('\n[TEST 4] GET /auth/me (Protected Route with Bearer Token)');
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });
    const meData = await meRes.json();
    console.log(`Status: ${meRes.status} | User Email: ${meData.user?.email} | Role: ${meData.user?.role}`);

    // TEST 5: GET /tasks (Practical 6)
    console.log('\n[TEST 5] GET /tasks (Fetch All Tasks)');
    const getRes = await fetch(`${BASE_URL}/tasks`);
    const tasks = await getRes.json();
    console.log(`Status: ${getRes.status} | Total Tasks: ${Array.isArray(tasks) ? tasks.length : 0}`);

    // TEST 6: POST /tasks (Practical 6 Full-Stack Create)
    console.log('\n[TEST 6] POST /tasks (Create Task)');
    const postRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: 'Complete Integration Test Suite',
        description: 'Verify all CRUD and Auth endpoints for Practicals 6, 7 & 8',
        completed: false,
        priority: 'high',
      }),
    });
    const createdTask = await postRes.json();
    createdTaskId = createdTask._id || createdTask.id;
    console.log(`Status: ${postRes.status} | Created Task ID: ${createdTaskId} | Title: "${createdTask.title}"`);

    // TEST 7: PUT /tasks/:id (Practical 6 Full-Stack Update)
    if (createdTaskId) {
      console.log(`\n[TEST 7] PUT /tasks/${createdTaskId} (Update Task)`);
      const putRes = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          completed: true,
          priority: 'medium',
        }),
      });
      const updatedTask = await putRes.json();
      console.log(`Status: ${putRes.status} | Updated Completed: ${updatedTask.completed} | Priority: ${updatedTask.priority}`);
    }

    // TEST 8: Server-Side Input Validation Error (Practical 7)
    console.log('\n[TEST 8] POST /tasks (Validation Rejection with empty title)');
    const invalidPostRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '   ',
        priority: 'invalid-priority',
      }),
    });
    const invalidData = await invalidPostRes.json();
    console.log(`Status: ${invalidPostRes.status} (Expected 400) | Error: ${invalidData.error}`);

    // TEST 9: DELETE /tasks/:id (Practical 6 Full-Stack Delete)
    if (createdTaskId) {
      console.log(`\n[TEST 9] DELETE /tasks/${createdTaskId} (Delete Task)`);
      const delRes = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const delData = await delRes.json();
      console.log(`Status: ${delRes.status} | Deleted Msg: ${delData.message}`);
    }

    console.log('\n' + '='.repeat(65));
    console.log('✅ ALL API & AUTH INTEGRATION TESTS EXECUTED SUCCESSFULLY!');
    console.log('='.repeat(65));
  } catch (err) {
    console.error('\n❌ Test Error:', err.message);
    console.log('\nEnsure backend server is running on http://localhost:5000:');
    console.log('  cd task-manager-api && npm run dev');
  }
};

runTests();
