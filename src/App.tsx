import { useEffect, useState } from 'react';
import { IfThenPlanner } from './components/intentions/IfThenPlanner';
import { TaskManager } from './components/tasks/TaskManager';
import { CelebrationAnimation } from './components/tasks/CelebrationAnimation';
import { IntegratedCheckIn, CheckInData } from './components/checkin/IntegratedCheckIn';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { db } from './db/database';
import { getTimeOfDay } from './utils/timeUtils';
import { IfThenPlan, Task, TaskPriority, CheckInEntry } from './types';
import './App.css';

type View = 'tasks' | 'checkin' | 'analytics' | 'plans';

function App() {
  const [currentView, setCurrentView] = useState<View>('tasks');
  const [dbReady, setDbReady] = useState(false);
  const [plans, setPlans] = useState<IfThenPlan[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lastCheckIn, setLastCheckIn] = useState<CheckInEntry | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Initialize database
  useEffect(() => {
    db.init()
      .then(() => {
        setDbReady(true);
        console.log('Database initialized successfully');
      })
      .catch((error) => {
        console.error('Failed to initialize database:', error);
      });
  }, []);

  // Load if-then plans
  useEffect(() => {
    if (dbReady) {
      db.getAllPlans()
        .then(setPlans)
        .catch(console.error);
    }
  }, [dbReady, currentView]);

  // Load tasks
  useEffect(() => {
    if (dbReady) {
      loadTasks();
    }
  }, [dbReady]);

  const loadTasks = async () => {
    try {
      const todayTasks = await db.getTodayTasks();
      setTasks(todayTasks);
    } catch (error) {
      console.error('Failed to load tasks:', error);
    }
  };

  // Load last check-in
  useEffect(() => {
    if (dbReady) {
      loadLastCheckIn();
    }
  }, [dbReady]);

  const loadLastCheckIn = async () => {
    try {
      const checkIns = await db.getCheckIns(1); // Get most recent
      if (checkIns.length > 0) {
        setLastCheckIn(checkIns[0]);
      }
    } catch (error) {
      console.error('Failed to load last check-in:', error);
    }
  };

  // Handle integrated check-in
  const handleCheckInSubmit = async (data: CheckInData) => {
    try {
      await db.saveCheckIn({
        timestamp: new Date(),
        energyLevel: data.energyLevel,
        activeInterventions: data.activeInterventions,
        notes: data.notes,
        tasksCompleted: 0, // Could integrate with task count
        timeOfDay: getTimeOfDay(),
      });

      await loadLastCheckIn();
      showSuccessMessage();
    } catch (error) {
      console.error('Failed to save check-in:', error);
    }
  };

  const handlePlanSave = async (plan: Omit<IfThenPlan, 'id'>) => {
    try {
      await db.saveIfThenPlan(plan);

      // Reload plans
      const updatedPlans = await db.getAllPlans();
      setPlans(updatedPlans);

      showSuccessMessage();
      console.log('Plan saved:', plan);
    } catch (error) {
      console.error('Failed to save plan:', error);
    }
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  // Task handlers
  const handleAddTask = async (title: string, priority: TaskPriority) => {
    try {
      await db.saveTask({
        title,
        priority,
        completed: false,
        createdAt: new Date(),
      });

      await loadTasks();
      showSuccessMessage();
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  const handleToggleTask = async (id: number) => {
    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      if (!task.completed) {
        // Completing task - show celebration!
        await db.completeTask(id);
        setShowCelebration(true);
      } else {
        // Un-completing task
        await db.updateTask(id, { completed: false, completedAt: undefined });
      }

      await loadTasks();
    } catch (error) {
      console.error('Failed to toggle task:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    try {
      await db.deleteTask(id);
      await loadTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  if (!dbReady) {
    return (
      <div className="app-loading">
        <div className="app-loading__spinner"></div>
        <p>Initializing...</p>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <h1 className="app-header__title">ADHD Productivity Tracker</h1>
        <p className="app-header__subtitle">
          Evidence-based tools for tracking energy, interventions, and intentions
        </p>
      </header>

      {/* Navigation */}
      <nav className="app-nav">
        <button
          className={`app-nav__button ${currentView === 'tasks' ? 'active' : ''}`}
          onClick={() => setCurrentView('tasks')}
        >
          <span className="app-nav__icon">✓</span>
          <span>Tasks</span>
        </button>
        <button
          className={`app-nav__button ${currentView === 'checkin' ? 'active' : ''}`}
          onClick={() => setCurrentView('checkin')}
        >
          <span className="app-nav__icon">📊</span>
          <span>Check-In</span>
        </button>
        <button
          className={`app-nav__button ${currentView === 'analytics' ? 'active' : ''}`}
          onClick={() => setCurrentView('analytics')}
        >
          <span className="app-nav__icon">📈</span>
          <span>Insights</span>
        </button>
        <button
          className={`app-nav__button ${currentView === 'plans' ? 'active' : ''}`}
          onClick={() => setCurrentView('plans')}
        >
          <span className="app-nav__icon">🔄</span>
          <span>Plans</span>
        </button>
      </nav>

      {/* Success notification */}
      {showSuccess && (
        <div className="app-success">
          <span className="app-success__icon">✓</span>
          <span>Saved successfully!</span>
        </div>
      )}

      {/* Main content */}
      <main className="app-main">
        {currentView === 'tasks' && (
          <TaskManager
            tasks={tasks}
            onAddTask={handleAddTask}
            onToggleTask={handleToggleTask}
            onDeleteTask={handleDeleteTask}
          />
        )}
        {currentView === 'checkin' && (
          <IntegratedCheckIn
            onSubmit={handleCheckInSubmit}
            lastCheckIn={lastCheckIn ? {
              energyLevel: lastCheckIn.energyLevel,
              timestamp: lastCheckIn.timestamp,
              interventions: lastCheckIn.activeInterventions,
            } : undefined}
          />
        )}
        {currentView === 'analytics' && <AnalyticsView />}
        {currentView === 'plans' && (
          <IfThenPlanner onSave={handlePlanSave} existingPlans={plans} />
        )}
      </main>

      {/* Celebration Animation */}
      <CelebrationAnimation
        show={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />

      {/* Footer */}
      <footer className="app-footer">
        <p>
          Built with ADHD-friendly design principles: minimal cognitive load, immediate feedback,
          and privacy-first local storage
        </p>
      </footer>
    </div>
  );
}

export default App;
