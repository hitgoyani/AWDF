import { EventEmitter } from 'events';

/**
 * Practical 10: Asynchronous Processing with Event-Driven Architecture
 * Native Node.js EventEmitter without external dependencies to decouple background
 * tasks, notifications, and auditing from the main HTTP request-response cycle.
 */
class TaskEvents extends EventEmitter {}

export const taskEvents = new TaskEvents();

// Set sensible max listeners limit
taskEvents.setMaxListeners(25);

export default taskEvents;
