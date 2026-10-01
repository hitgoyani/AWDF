import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { getTasks, createTask, updateTask, deleteTask, checkApiHealth } from '../api/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import ConfirmModal from '../components/ConfirmModal.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';

// Practical 8 Supplementary: Code-splitting heavy analytics widget lazily
const TaskAnalytics = lazy(() => import('../components/TaskAnalytics.jsx'));

function Tasks() {
  const { user, isAuthenticated } = useAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [serverStatus, setServerStatus] = useState({ online: false, db: 'Checking...' });

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Form states for Create Task
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState('medium');
  const [creating, setCreating] = useState(false);

  // Edit Task modal states
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPriority, setEditPriority] = useState('medium');
  const [editCompleted, setEditCompleted] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Delete Confirmation Modal states (Practical 6 Supplementary)
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  // Practical 8 Supplementary: Toggle heavy analytics view
  const [showAnalytics, setShowAnalytics] = useState(false);

  // 1. Fetch server status and tasks from Express backend
  const loadTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check health
      try {
        const health = await checkApiHealth();
        setServerStatus({ online: true, db: health.database || 'Connected' });
      } catch {
        setServerStatus({ online: false, db: 'Offline' });
      }

      const data = await getTasks();
      if (Array.isArray(data)) {
        setTasks(data);
      } else {
        setTasks([]);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks from backend server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // 2. Create Task (POST /tasks) with optimistic UI update
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      showError('Task title is required.');
      return;
    }

    setCreating(true);

    const tempId = `temp-${Date.now()}`;
    const newTaskPayload = {
      title: newTitle.trim(),
      description: newDescription.trim(),
      priority: newPriority,
      completed: false,
      userEmail: user?.email || 'guest@example.com',
    };

    // Optimistic UI update (Practical 6 Supplementary Problem)
    const optimisticTask = {
      _id: tempId,
      id: tempId,
      ...newTaskPayload,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    };
    setTasks((prev) => [optimisticTask, ...prev]);

    try {
      const created = await createTask(newTaskPayload);
      // Replace optimistic item with verified backend MongoDB item
      setTasks((prev) => prev.map((t) => (t._id === tempId ? created : t)));
      showSuccess(`Task "${created.title}" created and saved to database!`);
      setNewTitle('');
      setNewDescription('');
      setNewPriority('medium');
    } catch (err) {
      // Revert optimistic update on failure
      setTasks((prev) => prev.filter((t) => t._id !== tempId));
      showError(err.message || 'Failed to create task.');
    } finally {
      setCreating(false);
    }
  };

  // 3. Toggle Completion (PUT /tasks/:id)
  const handleToggleComplete = async (task) => {
    const taskId = task._id || task.id;
    const nextCompleted = !task.completed;

    // Optimistic state toggle
    setTasks((prev) =>
      prev.map((t) => ((t._id || t.id) === taskId ? { ...t, completed: nextCompleted } : t))
    );

    try {
      await updateTask(taskId, { completed: nextCompleted });
      showInfo(`Marked "${task.title}" as ${nextCompleted ? 'completed' : 'pending'}.`);
    } catch (err) {
      // Revert on error
      setTasks((prev) =>
        prev.map((t) => ((t._id || t.id) === taskId ? { ...t, completed: !nextCompleted } : t))
      );
      showError(err.message || 'Failed to update task status.');
    }
  };

  // 4. Open Edit Modal
  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTitle(task.title || '');
    setEditDescription(task.description || '');
    setEditPriority(task.priority || 'medium');
    setEditCompleted(Boolean(task.completed));
  };

  // 5. Submit Edit Task (PUT /tasks/:id)
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      showError('Task title is required.');
      return;
    }

    const taskId = editingTask._id || editingTask.id;
    setUpdating(true);

    const updatePayload = {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
      completed: editCompleted,
    };

    try {
      const updated = await updateTask(taskId, updatePayload);
      setTasks((prev) => prev.map((t) => ((t._id || t.id) === taskId ? updated : t)));
      showSuccess(`Task "${updated.title}" updated successfully!`);
      setEditingTask(null);
    } catch (err) {
      showError(err.message || 'Failed to update task.');
    } finally {
      setUpdating(false);
    }
  };

  // 6. Delete Task Dialog Handler (Practical 6 Supplementary)
  const promptDeleteTask = (id) => {
    setDeletingTaskId(id);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTask = async () => {
    if (!deletingTaskId) return;

    const idToDelete = deletingTaskId;
    setDeleteModalOpen(false);
    setDeletingTaskId(null);

    // Optimistic deletion
    const taskToDelete = tasks.find((t) => (t._id || t.id) === idToDelete);
    setTasks((prev) => prev.filter((t) => (t._id || t.id) !== idToDelete));

    try {
      await deleteTask(idToDelete);
      showSuccess(`Task "${taskToDelete?.title || idToDelete}" deleted successfully.`);
    } catch (err) {
      // Revert on error
      if (taskToDelete) {
        setTasks((prev) => [taskToDelete, ...prev]);
      }
      showError(err.message || 'Failed to delete task.');
    }
  };

  // Filter tasks based on search & selectors
  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.description && t.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && t.completed) ||
      (statusFilter === 'pending' && !t.completed);

    return matchesSearch && matchesPriority && matchesStatus;
  });

  return (
    <section className="section tasks-page animate-card">
      <div className="section-header">
        <div>
          <span className="section-tag">Practical 6 & 7 • Full-Stack CRUD</span>
          <h2>Task Management Dashboard</h2>
          <p className="section-desc">
            End-to-end React + Express + MongoDB integration with live state synchronization
          </p>
        </div>

        <div className="task-header-actions">
          <div className={`server-status-pill ${serverStatus.online ? 'online' : 'offline'}`}>
            <span className="status-indicator-dot"></span>
            <span>API: {serverStatus.online ? 'Online' : 'Offline'}</span>
            <span className="db-badge">({serverStatus.db})</span>
          </div>

          <button
            type="button"
            className={`btn-analytics-toggle ${showAnalytics ? 'active' : ''}`}
            onClick={() => setShowAnalytics(!showAnalytics)}
            title="Practical 8: Lazy load heavy analytics component"
          >
            📊 {showAnalytics ? 'Hide Analytics' : 'Lazy Load Analytics'}
          </button>

          <button type="button" onClick={loadTasks} className="btn-refresh" title="Re-fetch tasks from backend">
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Practical 8: Lazy Loaded Heavy Component */}
      {showAnalytics && (
        <Suspense
          fallback={
            <div className="lazy-inline-spinner">
              <span className="spinner-dot"></span>
              <span>Loading Analytics chunk asynchronously...</span>
            </div>
          }
        >
          <TaskAnalytics tasks={tasks} />
        </Suspense>
      )}

      {/* Create Task Form */}
      <div className="task-creator-card">
        <div className="creator-header">
          <h3>✨ Create New Task</h3>
          <span className="auth-status-note">
            {isAuthenticated ? `Logged in as ${user?.name}` : 'Creating as Guest Mode'}
          </span>
        </div>

        <form onSubmit={handleCreateTask} className="task-create-form">
          <div className="form-row-2col">
            <div className="form-group flex-2">
              <label htmlFor="task-title" className="form-label">
                Task Title <span className="req">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                placeholder="e.g. Implement React Lazy Loading & Suspense"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="form-input"
                required
              />
            </div>

            <div className="form-group flex-1">
              <label htmlFor="task-priority" className="form-label">
                Priority
              </label>
              <select
                id="task-priority"
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value)}
                className="form-select"
              >
                <option value="low">🌱 Low</option>
                <option value="medium">⚡ Medium</option>
                <option value="high">🔥 High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="task-desc" className="form-label">
              Description (Optional)
            </label>
            <textarea
              id="task-desc"
              rows="2"
              placeholder="Describe what needs to be completed..."
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              className="form-textarea"
            ></textarea>
          </div>

          <div className="form-submit-row">
            <button type="submit" className="btn-create-task" disabled={creating}>
              {creating ? 'Saving to Database...' : '➕ Add Task to Server'}
            </button>
          </div>
        </form>
      </div>

      {/* Search & Filter Bar */}
      <div className="tasks-filter-bar">
        <div className="search-filter-input-wrap">
          <span className="filter-icon">🔎</span>
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="filter-input-box"
          />
          {searchQuery && (
            <button type="button" className="btn-clear-search" onClick={() => setSearchQuery('')}>
              ✕
            </button>
          )}
        </div>

        <div className="filter-dropdowns-group">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="filter-select-pill"
          >
            <option value="all">All Priorities</option>
            <option value="high">🔥 High Priority</option>
            <option value="medium">⚡ Medium Priority</option>
            <option value="low">🌱 Low Priority</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select-pill"
          >
            <option value="all">All Status</option>
            <option value="completed">✅ Completed</option>
            <option value="pending">⏳ Pending</option>
          </select>
        </div>
      </div>

      {/* Content State Handling */}
      {loading && <Spinner message="Fetching tasks from Express & MongoDB backend..." />}

      {!loading && error && <ErrorMessage message={error} onRetry={loadTasks} />}

      {!loading && !error && (
        <>
          <div className="tasks-count-summary">
            Showing <strong>{filteredTasks.length}</strong> of <strong>{tasks.length}</strong> tasks
          </div>

          {filteredTasks.length === 0 ? (
            <div className="no-data-card">
              <span className="no-data-icon">📝</span>
              <h3>No tasks found</h3>
              <p>
                {tasks.length === 0
                  ? 'No tasks in the database yet. Create your first task above!'
                  : 'No tasks match your current search and filter criteria.'}
              </p>
            </div>
          ) : (
            <div className="tasks-grid">
              {filteredTasks.map((task) => {
                const taskId = task._id || task.id;
                return (
                  <div
                    key={taskId}
                    className={`task-card-item ${task.completed ? 'completed' : ''} ${
                      task.isOptimistic ? 'optimistic' : ''
                    }`}
                  >
                    <div className="task-card-top">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          checked={Boolean(task.completed)}
                          onChange={() => handleToggleComplete(task)}
                          title="Click to toggle completion status"
                        />
                        <span className="custom-checkmark"></span>
                      </label>

                      <span className={`priority-badge priority-${task.priority || 'medium'}`}>
                        {task.priority === 'high' && '🔥 High'}
                        {task.priority === 'medium' && '⚡ Medium'}
                        {task.priority === 'low' && '🌱 Low'}
                      </span>
                    </div>

                    <h3 className="task-item-title">{task.title}</h3>

                    {task.description && <p className="task-item-desc">{task.description}</p>}

                    <div className="task-card-footer">
                      <span className="task-date-info">
                        📅 {new Date(task.createdAt || Date.now()).toLocaleDateString()}
                      </span>

                      <div className="task-item-actions">
                        <button
                          type="button"
                          className="btn-action-edit"
                          onClick={() => openEditModal(task)}
                          title="Edit Task"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="btn-action-delete"
                          onClick={() => promptDeleteTask(taskId)}
                          title="Delete Task (Opens confirmation modal)"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Confirmation Dialog Modal (Practical 6 Supplementary) */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        title="Delete Task Confirmation"
        message="Are you sure you want to delete this task? This action will permanently remove it from MongoDB."
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteTask}
        onCancel={() => setDeleteModalOpen(false)}
        isDanger={true}
      />

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="modal-overlay animate-fade-in" onClick={() => setEditingTask(null)}>
          <div className="modal-dialog animate-scale-up" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-icon">✏️</span>
              <h3 className="modal-title">Edit Task</h3>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="edit-title" className="form-label">
                    Task Title <span className="req">*</span>
                  </label>
                  <input
                    id="edit-title"
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="edit-priority" className="form-label">
                    Priority
                  </label>
                  <select
                    id="edit-priority"
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value)}
                    className="form-select"
                  >
                    <option value="low">🌱 Low</option>
                    <option value="medium">⚡ Medium</option>
                    <option value="high">🔥 High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="edit-desc" className="form-label">
                    Description
                  </label>
                  <textarea
                    id="edit-desc"
                    rows="3"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="form-textarea"
                  ></textarea>
                </div>

                <div className="form-group-checkbox">
                  <label className="checkbox-inline-label">
                    <input
                      type="checkbox"
                      checked={editCompleted}
                      onChange={(e) => setEditCompleted(e.target.checked)}
                    />
                    <span>Mark as Completed</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-modal-cancel" onClick={() => setEditingTask(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn-modal-confirm primary" disabled={updating}>
                  {updating ? 'Saving...' : '💾 Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Tasks;
