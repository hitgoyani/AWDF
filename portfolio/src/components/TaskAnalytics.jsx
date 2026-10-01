import { useState } from 'react';

/**
 * Task Analytics & Performance Visualizer Component (Practical 8 Supplementary)
 * Demonstrates component-level dynamic loading (code-split heavy analytics widget).
 */
function TaskAnalytics({ tasks = [] }) {
  const [activeMetric, setActiveMetric] = useState('overview');

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  const highPriority = tasks.filter((t) => t.priority === 'high').length;
  const mediumPriority = tasks.filter((t) => t.priority === 'medium').length;
  const lowPriority = tasks.filter((t) => t.priority === 'low').length;

  return (
    <div className="task-analytics-card animate-scale-up">
      <div className="analytics-header">
        <div>
          <span className="section-tag">Practical 8 • Lazy Loaded Widget</span>
          <h3>📊 Real-Time Task Analytics</h3>
          <p className="analytics-sub">Dynamically loaded heavy visualizer chunk</p>
        </div>
        <div className="analytics-tabs">
          <button
            type="button"
            className={`analytics-tab-btn ${activeMetric === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveMetric('overview')}
          >
            Overview
          </button>
          <button
            type="button"
            className={`analytics-tab-btn ${activeMetric === 'priority' ? 'active' : ''}`}
            onClick={() => setActiveMetric('priority')}
          >
            Priorities
          </button>
        </div>
      </div>

      <div className="analytics-stats-grid">
        <div className="stat-card">
          <span className="stat-num">{total}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card stat-success">
          <span className="stat-num">{completed}</span>
          <span className="stat-label">Completed ({completionRate}%)</span>
        </div>
        <div className="stat-card stat-warning">
          <span className="stat-num">{pending}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-danger">
          <span className="stat-num">{highPriority}</span>
          <span className="stat-label">High Priority</span>
        </div>
      </div>

      {activeMetric === 'overview' && (
        <div className="analytics-chart-box">
          <div className="progress-bar-title-row">
            <span>Overall Completion Progress</span>
            <strong>{completionRate}%</strong>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${completionRate}%` }}
              role="progressbar"
              aria-valuenow={completionRate}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="legend-dot green"></span> Completed ({completed})</span>
            <span className="legend-item"><span className="legend-dot amber"></span> Pending ({pending})</span>
          </div>
        </div>
      )}

      {activeMetric === 'priority' && (
        <div className="priority-bars-container">
          <div className="priority-bar-row">
            <span className="p-label">🔥 High Priority</span>
            <div className="p-track">
              <div
                className="p-fill high"
                style={{ width: `${total ? (highPriority / total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="p-count">{highPriority}</span>
          </div>
          <div className="priority-bar-row">
            <span className="p-label">⚡ Medium Priority</span>
            <div className="p-track">
              <div
                className="p-fill medium"
                style={{ width: `${total ? (mediumPriority / total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="p-count">{mediumPriority}</span>
          </div>
          <div className="priority-bar-row">
            <span className="p-label">🌱 Low Priority</span>
            <div className="p-track">
              <div
                className="p-fill low"
                style={{ width: `${total ? (lowPriority / total) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="p-count">{lowPriority}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskAnalytics;
