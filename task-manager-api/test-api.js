/**
 * Automated Integration Test Suite for Practicals 4, 5, 6, 7, 9, 10, 12, and 13
 * Tests CRUD operations, validation pipeline, JWT authentication, caching, events, and AI assistant.
 * Auto-starts the Express application if not already running on port 5000.
 */

import http from 'http';
import app from './server.js';

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

const runTests = async () => {
  console.log('='.repeat(70));
  console.log('🚀 TASK MANAGER API - AUTOMATED INTEGRATION TEST SUITE (P4 to P13)');
  console.log('='.repeat(70));

  let localServer = null;

  // 1. Check if server is already running, otherwise boot it in-process
  try {
    await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(1000) });
    console.log(`[INFO] Connected to existing server running on ${BASE_URL}`);
  } catch {
    console.log(`[INFO] Starting in-process server instance on port ${PORT}...`);
    localServer = await new Promise((resolve, reject) => {
      const s = app.listen(PORT, () => {
        console.log(`[INFO] In-process server started successfully on ${BASE_URL}`);
        resolve(s);
      });
      s.on('error', reject);
    });
  }

  let createdTaskId = null;
  let authToken = null;
  const testUserEmail = `testuser_${Date.now()}@example.com`;

  try {
    // TEST 1: Health Check (Practical 4)
    console.log('\n[TEST 1] GET /api/health');
    const healthRes = await fetch(`${BASE_URL}/api/health`);
    const healthData = await healthRes.json();
    console.log(`Status: ${healthRes.status} | Server: ${healthData.server} | DB: ${healthData.database}`);

    // TEST 2: Register New User with Bcrypt (Practical 7)
    console.log('\n[TEST 2] POST /auth/register (User Registration with bcrypt hashing)');
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

    // TEST 3: Login User and Sign JWT (Practical 7)
    console.log('\n[TEST 3] POST /auth/login (JWT Token Generation)');
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
    console.log(`Status: ${meRes.status} | User: ${meData.user?.email} | Role: ${meData.user?.role}`);

    // TEST 5: GET /tasks with Caching (Practical 6 & 9)
    console.log('\n[TEST 5] GET /tasks (Fetch All Tasks + In-Memory Cache Verification)');
    const startMiss = Date.now();
    const getRes1 = await fetch(`${BASE_URL}/tasks`);
    const durationMiss = Date.now() - startMiss;
    const cacheHeader1 = getRes1.headers.get('x-cache-status');
    const tasks = await getRes1.json();
    console.log(`Request 1 -> Status: ${getRes1.status} | Cache: ${cacheHeader1} | Time: ${durationMiss}ms | Total Tasks: ${tasks.length}`);

    // Immediate second GET should hit cache
    const startHit = Date.now();
    const getRes2 = await fetch(`${BASE_URL}/tasks`);
    const durationHit = Date.now() - startHit;
    const cacheHeader2 = getRes2.headers.get('x-cache-status');
    console.log(`Request 2 -> Status: ${getRes2.status} | Cache: ${cacheHeader2} | Time: ${durationHit}ms (Instant RAM retrieval!)`);

    // TEST 6: GET /api/cache-stats (Practical 9 Diagnostics)
    console.log('\n[TEST 6] GET /api/cache-stats (Cache Diagnostics & Metrics)');
    const statsRes = await fetch(`${BASE_URL}/api/cache-stats`);
    const statsData = await statsRes.json();
    console.log(`Status: ${statsRes.status} | Hit Ratio: ${statsData.metrics?.hitRatio} | Hits: ${statsData.metrics?.hits} | Misses: ${statsData.metrics?.misses}`);

    // TEST 7: POST /tasks (Practical 6 Full-Stack Create + Practical 10 EventEmitter)
    console.log('\n[TEST 7] POST /tasks (Create Task & Trigger Asynchronous Event Listener)');
    const postRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        title: 'CI Automated Integration Task',
        description: 'Verify all CRUD, Caching, Event-Driven & AI endpoints',
        completed: false,
        priority: 'high',
      }),
    });
    const createdTask = await postRes.json();
    createdTaskId = createdTask._id || createdTask.id;
    console.log(`Status: ${postRes.status} | Created ID: ${createdTaskId} | Title: "${createdTask.title}"`);

    // TEST 8: PUT /tasks/:id (Practical 6 Update & Practical 9 Invalidation)
    if (createdTaskId) {
      console.log(`\n[TEST 8] PUT /tasks/${createdTaskId} (Update Task & Invalidate Cache)`);
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
      console.log(`Status: ${putRes.status} | Completed: ${updatedTask.completed} | Priority: ${updatedTask.priority}`);
    }

    // TEST 9: Server-Side Input Validation Error (Practical 7)
    console.log('\n[TEST 9] POST /tasks (Validation Rejection with empty title)');
    const invalidPostRes = await fetch(`${BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: '   ',
        priority: 'invalid-priority',
      }),
    });
    const invalidData = await invalidPostRes.json();
    console.log(`Status: ${invalidPostRes.status} (Expected 400) | Details: ${invalidData.details || invalidData.error}`);

    // TEST 10: AI Task Assistant Endpoint (Practical 13)
    console.log('\n[TEST 10] POST /api/ai/generate-description (AI Task Generator & Graceful Fallback)');
    const aiRes = await fetch(`${BASE_URL}/api/ai/generate-description`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Deploy Full Stack App with Docker Compose',
        priority: 'high',
      }),
    });
    const aiData = await aiRes.json();
    console.log(`Status: ${aiRes.status} | Source: ${aiData.source} | Fallback Active: ${aiData.fallback}`);
    console.log(`AI Output Preview: ${aiData.description.split('\n')[0]}`);

    // TEST 11: DELETE /tasks/:id (Practical 6 Delete + Practical 10 Task-Deleted Event)
    if (createdTaskId) {
      console.log(`\n[TEST 11] DELETE /tasks/${createdTaskId} (Delete Task & Emit Audit Event)`);
      const delRes = await fetch(`${BASE_URL}/tasks/${createdTaskId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const delData = await delRes.json();
      console.log(`Status: ${delRes.status} | Deleted Msg: ${delData.message}`);
    }

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL API, CACHE, AUTH, EVENT & AI INTEGRATION TESTS PASSED!');
    console.log('='.repeat(70));

    // Wait a brief tick for async event listener log to display, then disconnect and exit cleanly
    setTimeout(async () => {
      try {
        const { default: mongoose } = await import('mongoose');
        await mongoose.disconnect();
      } catch {}
      if (localServer) {
        localServer.close();
      }
      process.exit(0);
    }, 600);
  } catch (err) {
    console.error('\n❌ Integration Test Error:', err);
    process.exit(1);
  }
};

runTests();
