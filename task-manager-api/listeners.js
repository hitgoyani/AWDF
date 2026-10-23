import taskEvents from './events.js';

/**
 * Practical 10: Event Listeners Registration
 * Demonstrates non-blocking background notification and audit logs with timestamp verification.
 */
let isInitialized = false;

// In-memory event audit log for inspection / verification
export const eventAuditLogs = [];

export function initializeEventListeners() {
  if (isInitialized) return;
  isInitialized = true;

  // 1. Task Created Event Listener (Simulates background notification dispatch)
  taskEvents.on('task-created', (task) => {
    const emitReceivedTime = new Date().toISOString();
    console.log(`[EVENT RECEIVED: task-created] Task: "${task.title}" (ID: ${task._id || task.id}) at ${emitReceivedTime}`);

    // Simulated async notification latency (e.g. email / webhook dispatch)
    setTimeout(() => {
      const completionTime = new Date().toISOString();
      const logEntry = {
        event: 'task-created',
        taskId: task._id || task.id,
        title: task.title,
        recipient: task.userEmail || 'system@portfolio.local',
        status: 'DISPATCHED_ASYNC',
        responseReturnedBeforeCompletion: true,
        receivedAt: emitReceivedTime,
        completedAt: completionTime,
      };

      eventAuditLogs.unshift(logEntry);
      if (eventAuditLogs.length > 50) eventAuditLogs.pop();

      console.log(
        `[ASYNC NOTIFICATION COMPLETE] Email dispatched for Task "${task.title}" to ${logEntry.recipient} at ${completionTime} (Completed AFTER API response sent)`
      );
    }, 400); // 400ms non-blocking delay
  });

  // 2. Task Deleted Event Listener (Audit trail logging)
  taskEvents.on('task-deleted', (task) => {
    const timestamp = new Date().toISOString();
    const logEntry = {
      event: 'task-deleted',
      taskId: task._id || task.id,
      title: task.title || 'Untitled',
      status: 'AUDIT_RECORDED',
      timestamp,
    };

    eventAuditLogs.unshift(logEntry);
    if (eventAuditLogs.length > 50) eventAuditLogs.pop();

    console.log(`[AUDIT LOG] Task "${logEntry.title}" (ID: ${logEntry.taskId}) was permanently removed at ${timestamp}`);
  });

  // 3. Centralized Error Listener for Unhandled Event Exceptions
  taskEvents.on('error', (err) => {
    console.error(`[EVENT SUBSYSTEM ERROR] Unhandled event exception: ${err.message}`, err.stack);
  });

  console.log('[EVENTS] Practical 10 EventEmitter listeners successfully registered');
}

export default initializeEventListeners;
