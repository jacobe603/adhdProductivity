import { useState } from 'react';
import { Task, TaskPriority } from '../../types';
import './TaskManager.css';

interface TaskManagerProps {
  tasks: Task[];
  onAddTask: (title: string, priority: TaskPriority) => Promise<void>;
  onToggleTask: (id: number) => Promise<void>;
  onDeleteTask: (id: number) => Promise<void>;
}

export function TaskManager({ tasks, onAddTask, onToggleTask, onDeleteTask }: TaskManagerProps) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<TaskPriority>('must-do');
  const [isAdding, setIsAdding] = useState(false);

  // Quick add with Enter key
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTaskTitle.trim()) {
      handleAddTask();
    }
  };

  const handleAddTask = async () => {
    if (!newTaskTitle.trim()) return;

    setIsAdding(true);
    try {
      await onAddTask(newTaskTitle.trim(), selectedPriority);
      setNewTaskTitle('');
    } finally {
      setIsAdding(false);
    }
  };

  // Separate tasks by priority
  const mustDoTasks = tasks.filter((t) => t.priority === 'must-do' && !t.completed);
  const wantToTasks = tasks.filter((t) => t.priority === 'want-to' && !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  // Count completions
  const mustDoCompleted = tasks.filter((t) => t.priority === 'must-do' && t.completed).length;
  const wantToCompleted = tasks.filter((t) => t.priority === 'want-to' && t.completed).length;

  return (
    <div className="task-manager">
      {/* Quick Add Section - Always Visible */}
      <div className="task-quick-add">
        <h2>Add Task</h2>

        {/* Priority selector */}
        <div className="task-priority-selector">
          <button
            className={`priority-button must-do ${
              selectedPriority === 'must-do' ? 'active' : ''
            }`}
            onClick={() => setSelectedPriority('must-do')}
            type="button"
          >
            <span className="priority-icon">⭐</span>
            Must-Do
          </button>
          <button
            className={`priority-button want-to ${
              selectedPriority === 'want-to' ? 'active' : ''
            }`}
            onClick={() => setSelectedPriority('want-to')}
            type="button"
          >
            <span className="priority-icon">💫</span>
            Want-To
          </button>
        </div>

        {/* Input with fast entry */}
        <div className="task-input-group">
          <input
            type="text"
            className="task-input"
            placeholder="What needs to be done?"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isAdding}
            autoFocus
          />
          <button
            className="task-add-button"
            onClick={handleAddTask}
            disabled={!newTaskTitle.trim() || isAdding}
          >
            {isAdding ? '...' : '+'}
          </button>
        </div>

        <p className="task-hint">Press Enter or click + to add</p>
      </div>

      {/* Daily Progress Summary */}
      {(mustDoTasks.length > 0 || wantToTasks.length > 0 || completedTasks.length > 0) && (
        <div className="task-progress-summary">
          <div className="progress-stat">
            <span className="progress-label">⭐ Must-Do</span>
            <span className="progress-value">
              {mustDoCompleted} / {mustDoTasks.length + mustDoCompleted}
            </span>
          </div>
          <div className="progress-stat">
            <span className="progress-label">💫 Want-To</span>
            <span className="progress-value">
              {wantToCompleted} / {wantToTasks.length + wantToCompleted}
            </span>
          </div>
          <div className="progress-stat">
            <span className="progress-label">✓ Total</span>
            <span className="progress-value">{completedTasks.length}</span>
          </div>
        </div>
      )}

      {/* Must-Do Tasks */}
      {mustDoTasks.length > 0 && (
        <div className="task-section">
          <h3 className="task-section-title">
            <span className="task-section-icon">⭐</span>
            Must-Do Today ({mustDoTasks.length})
          </h3>
          <div className="task-list">
            {mustDoTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Want-To Tasks */}
      {wantToTasks.length > 0 && (
        <div className="task-section">
          <h3 className="task-section-title">
            <span className="task-section-icon">💫</span>
            Want-To ({wantToTasks.length})
          </h3>
          <div className="task-list">
            {wantToTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks - Collapsible */}
      {completedTasks.length > 0 && (
        <details className="task-section completed-section">
          <summary className="task-section-title">
            <span className="task-section-icon">✓</span>
            Completed ({completedTasks.length})
          </summary>
          <div className="task-list">
            {completedTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggleTask}
                onDelete={onDeleteTask}
              />
            ))}
          </div>
        </details>
      )}

      {/* Empty state */}
      {tasks.length === 0 && (
        <div className="task-empty-state">
          <p className="task-empty-icon">📝</p>
          <p className="task-empty-text">No tasks yet.</p>
          <p className="task-empty-subtext">Add your first task above to get started!</p>
        </div>
      )}
    </div>
  );
}

// Individual task item component
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!task.id) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } catch (error) {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''} ${isDeleting ? 'deleting' : ''}`}>
      <button
        className="task-checkbox"
        onClick={() => task.id && onToggle(task.id)}
        type="button"
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed ? '✓' : ''}
      </button>

      <div className="task-content">
        <span className="task-title">{task.title}</span>
        {task.completed && task.completedAt && (
          <span className="task-completed-time">
            Completed {new Date(task.completedAt).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </span>
        )}
      </div>

      <button
        className="task-delete"
        onClick={handleDelete}
        type="button"
        aria-label="Delete task"
        disabled={isDeleting}
      >
        ✕
      </button>
    </div>
  );
}
