import { useEffect, useState } from 'react';
import { EnergyTracker } from './components/energy/EnergyTracker';
import { InterventionTracker } from './components/interventions/InterventionTracker';
import { IfThenPlanner } from './components/intentions/IfThenPlanner';
import { TaskManager } from './components/tasks/TaskManager';
import { CelebrationAnimation } from './components/tasks/CelebrationAnimation';
import { db } from './db/database';
import { getTimeOfDay } from './utils/timeUtils';
import { EnergyLevel, IfThenPlan, Task, TaskPriority } from './types';
import './App.css';

type View = 'tasks' | 'energy' | 'interventions' | 'plans';

function App() {
  const [currentView, setCurrentView] = useState<View>('tasks');
  const [dbReady, setDbReady] = useState(false);
  const [plans, setPlans] = useState<IfThenPlan[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
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

  const handleEnergySave = async (energyLevel: EnergyLevel, notes?: string) => {
    try {
      await db.saveEnergyEntry({
        timestamp: new Date(),
        energyLevel,
        notes,
        timeOfDay: getTimeOfDay(),
      });

      showSuccessMessage();
      console.log('Energy entry saved:', energyLevel);
    } catch (error) {
      console.error('Failed to save energy entry:', error);
    }
  };

  const handleInterventionsSave = async (selectedInterventions: string[]) => {
    try {
      const timestamp = new Date();

      // Save each intervention log
      for (const interventionId of selectedInterventions) {
        // Get current energy level (simplified - in real app would track this)
        const energyLevel = 5 as EnergyLevel;

        await db.saveInterventionLog({
          timestamp,
          interventionId,
          interventionName: interventionId, // In real app, look up name
          contextBefore: { energyLevel },
        });
      }

      showSuccessMessage();
      console.log('Interventions saved:', selectedInterventions);
    } catch (error) {
      console.error('Failed to save interventions:', error);
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
          className={`app-nav__button ${currentView === 'energy' ? 'active' : ''}`}
          onClick={() => setCurrentView('energy')}
        >
          <span className="app-nav__icon">⚡</span>
          <span>Energy</span>
        </button>
        <button
          className={`app-nav__button ${currentView === 'interventions' ? 'active' : ''}`}
          onClick={() => setCurrentView('interventions')}
        >
          <span className="app-nav__icon">🎯</span>
          <span>Interventions</span>
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
        {currentView === 'energy' && <EnergyTracker onSubmit={handleEnergySave} />}
        {currentView === 'interventions' && (
          <InterventionTracker onSubmit={handleInterventionsSave} />
        )}
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
