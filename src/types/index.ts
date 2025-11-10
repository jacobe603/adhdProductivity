// Core data models for ADHD productivity app

export type EnergyLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export interface EnergyEntry {
  id?: number;
  timestamp: Date;
  energyLevel: EnergyLevel;
  focusQuality?: number; // 1-5
  mood?: number; // 1-10
  notes?: string;
  tasksCompleted?: number;
  // Time-of-day category
  timeOfDay: 'morning' | 'mid-morning' | 'afternoon' | 'late-afternoon' | 'evening';
}

export interface Intervention {
  id: string;
  name: string;
  category: 'appetizer' | 'entree' | 'side' | 'dessert';
  icon: string;
  description?: string;
}

export interface InterventionLog {
  id?: number;
  timestamp: Date;
  interventionId: string;
  interventionName: string;
  effectiveness?: number; // 1-5, user rated after session
  notes?: string;
  contextBefore: {
    energyLevel: EnergyLevel;
    mood?: number;
  };
  contextAfter?: {
    energyLevel: EnergyLevel;
    mood?: number;
    tasksCompleted?: number;
  };
}

export interface IfThenPlan {
  id?: number;
  trigger: string; // "If [this happens]"
  action: string; // "Then [do this]"
  category: 'task-initiation' | 'distraction-management' | 'routine' | 'energy-boost' | 'custom';
  isActive: boolean;
  createdAt: Date;
  timesUsed: number;
  successRate?: number; // 0-100
}

export interface CheckInEntry {
  id?: number;
  timestamp: Date;
  energyLevel: EnergyLevel;
  focusQuality?: number;
  mood?: number;
  activeInterventions: string[]; // IDs of interventions used
  tasksCompleted: number;
  notes?: string;
  timeOfDay: 'morning' | 'mid-morning' | 'afternoon' | 'late-afternoon' | 'evening';
}

// Medication tracking (optional but important for ADHD)
export interface MedicationLog {
  id?: number;
  timestamp: Date;
  medicationType: 'long-acting' | 'short-acting' | 'booster';
  notes?: string;
}

// Pre-defined interventions library
export const DEFAULT_INTERVENTIONS: Intervention[] = [
  // Appetizers (5-min dopamine boost)
  { id: 'walk-5', name: '5-min walk', category: 'appetizer', icon: '🚶' },
  { id: 'music-song', name: 'Favorite song', category: 'appetizer', icon: '🎵' },
  { id: 'stretch', name: 'Quick stretch', category: 'appetizer', icon: '🧘' },
  { id: 'water', name: 'Water break', category: 'appetizer', icon: '💧' },

  // Entrees (sustained engagement)
  { id: 'exercise', name: 'Exercise (30+ min)', category: 'entree', icon: '🏃' },
  { id: 'meditation', name: 'Meditation', category: 'entree', icon: '🧘‍♀️' },
  { id: 'creative-activity', name: 'Creative activity', category: 'entree', icon: '🎨' },

  // Sides (concurrent activities)
  { id: 'music-bg', name: 'Background music', category: 'side', icon: '🎧' },
  { id: 'coffee', name: 'Coffee/caffeine', category: 'side', icon: '☕' },
  { id: 'body-doubling', name: 'Body doubling', category: 'side', icon: '👥' },
  { id: 'ambient-sounds', name: 'Ambient sounds', category: 'side', icon: '🌊' },

  // Desserts (rewards after)
  { id: 'snack', name: 'Favorite snack', category: 'dessert', icon: '🍪' },
  { id: 'social-media', name: 'Social media (timed)', category: 'dessert', icon: '📱' },
  { id: 'game', name: 'Quick game', category: 'dessert', icon: '🎮' },
  { id: 'video', name: 'Video break', category: 'dessert', icon: '📺' },
];

// Default if-then plan templates
export const DEFAULT_IF_THEN_TEMPLATES = [
  {
    trigger: 'I sit at my desk in the morning',
    action: 'I will review my top 3 priorities for 2 minutes',
    category: 'task-initiation' as const,
  },
  {
    trigger: 'I notice I\'m distracted',
    action: 'I will write down the distracting thought and return to my task',
    category: 'distraction-management' as const,
  },
  {
    trigger: 'I feel overwhelmed by a task',
    action: 'I will break it into one 5-minute subtask and do just that',
    category: 'task-initiation' as const,
  },
  {
    trigger: 'My energy drops in the afternoon',
    action: 'I will take a 5-minute walk outside',
    category: 'energy-boost' as const,
  },
  {
    trigger: 'I wake up',
    action: 'I will take my medication with water before anything else',
    category: 'routine' as const,
  },
];

// Task Management Types (Phase 2)

export type TaskPriority = 'must-do' | 'want-to';
export type TaskImpact = 'low' | 'medium' | 'high';
export type TaskEffort = 'low' | 'medium' | 'high';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  priority: TaskPriority;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;

  // Impact-Effort Matrix
  impact?: TaskImpact;
  effort?: TaskEffort;

  // Integration with other systems
  energyLevelAtCompletion?: EnergyLevel;
  timeOfDayCompleted?: 'morning' | 'mid-morning' | 'afternoon' | 'late-afternoon' | 'evening';

  // Task breakdown
  subtasks?: SubTask[];
  parentTaskId?: number;

  // Context
  tags?: string[];
  notes?: string;
}

export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  estimatedMinutes?: number;
}

// Daily summary
export interface DailyProgress {
  date: string; // YYYY-MM-DD
  mustDoCompleted: number;
  mustDoTotal: number;
  wantToCompleted: number;
  wantToTotal: number;
  totalTasksCompleted: number;
  averageEnergyLevel?: number;
  interventionsUsed: string[];
}
