# ADHD Productivity App

An evidence-based productivity tracking app designed specifically for ADHD brains, built with React, TypeScript, and local-first architecture.

## 🚀 Live Demo

**[Try it now: https://jacobe603.github.io/adhdProductivity/](https://jacobe603.github.io/adhdProductivity/)**

All data is stored locally in your browser - completely private and works offline!

## Features

### Phase 1: Core Tracking ✅

#### 1. Energy Tracking & Visualization
- **Visual emoji slider** (1-10) for tracking energy levels throughout the day
- Time-of-day categorization (morning, mid-morning, afternoon, late-afternoon, evening)
- Optional notes for context
- Immediate visual feedback with color-coded energy states
- Large touch targets and clear visual hierarchy

#### 2. If-Then Implementation Intentions
- Research-backed "if-then" planning system that improves ADHD performance to neurotypical levels
- Pre-built templates for common scenarios:
  - Task initiation
  - Distraction management
  - Energy boosts
  - Routine building
- Custom plan creation with category tagging
- Success tracking for each plan

#### 3. Intervention Tracking
- **Dopamenu system** with 4 categories:
  - 🍿 **Appetizers**: 5-min dopamine boosts (walk, music, stretch)
  - 🍽️ **Entrees**: Sustained engagement (exercise, meditation)
  - 🥗 **Sides**: Concurrent activities (background music, coffee, body doubling)
  - 🍰 **Desserts**: Rewards after completion (snacks, social media, games)
- Quick-toggle interface for tracking active interventions
- Context tracking (energy before/after intervention)
- Effectiveness ratings

### Phase 2: Task Management ✅

#### 1. Lightning-Fast Task Capture
- **< 3 second task entry** - Optimized for ADHD brain
- Enter key or button to add instantly
- Auto-focus on input for immediate capture
- No required fields beyond task title

#### 2. Must-Do vs Want-To System
- **Must-Do**: 1-3 critical tasks per day (⭐)
- **Want-To**: Flexible tasks when energy allows (💫)
- Visual separation to reduce overwhelm
- Daily progress tracking for each category

#### 3. Completion Celebrations
- **Dopamine-boosting animations** when tasks complete
- Random encouraging messages (🎉 "Awesome!", ⚡ "Boom!")
- Colorful confetti particles
- Immediate positive reinforcement

#### 4. Task Management Features
- Large, clear checkboxes (easy to tap/click)
- Completion timestamps
- Quick delete with confirmation
- Collapsible completed section
- Empty state guidance

#### 5. Daily Progress Dashboard
- Real-time task completion counts
- Must-Do vs Want-To progress bars
- Total tasks completed today
- Visual progress summary

## ADHD-Friendly Design Principles

✓ **Minimal cognitive load**: Simple 4-tab navigation, single primary CTA per screen
✓ **Immediate feedback**: Visual animations, color changes, success notifications
✓ **Large touch targets**: All interactive elements optimized for easy selection
✓ **Clear visual hierarchy**: Generous whitespace, clear typography, high contrast
✓ **Privacy-first**: All data stored locally in IndexedDB, works completely offline
✓ **Progressive disclosure**: Optional fields hidden by default, revealed on demand

## Tech Stack

- **React 19** with TypeScript for type safety
- **Vite** for fast development and optimized builds
- **IndexedDB** for local-first, offline-capable storage
- **CSS** with ADHD-friendly design tokens
- **No external dependencies** for core functionality (privacy-first)

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development Server
```bash
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── energy/
│   │   ├── EnergyTracker.tsx       # Energy level tracking UI
│   │   └── EnergyTracker.css
│   ├── interventions/
│   │   ├── InterventionTracker.tsx # Dopamenu intervention tracking
│   │   └── InterventionTracker.css
│   └── intentions/
│       ├── IfThenPlanner.tsx       # If-then plan creation
│       └── IfThenPlanner.css
├── db/
│   └── database.ts                  # IndexedDB wrapper
├── types/
│   └── index.ts                     # TypeScript type definitions
├── utils/
│   └── timeUtils.ts                 # Time-of-day utilities
├── App.tsx                          # Main app component
├── App.css
├── main.tsx                         # Entry point
└── index.css                        # Global styles
```

## Data Models

### Energy Entry
```typescript
{
  energyLevel: 1-10,
  timestamp: Date,
  timeOfDay: 'morning' | 'mid-morning' | 'afternoon' | 'late-afternoon' | 'evening',
  notes?: string
}
```

### Intervention Log
```typescript
{
  interventionId: string,
  timestamp: Date,
  contextBefore: { energyLevel: 1-10 },
  contextAfter?: { energyLevel: 1-10, tasksCompleted: number },
  effectiveness?: 1-5
}
```

### If-Then Plan
```typescript
{
  trigger: string,        // "If I sit at my desk"
  action: string,         // "Then I will review top 3 priorities"
  category: 'task-initiation' | 'distraction-management' | 'energy-boost' | 'routine',
  isActive: boolean,
  timesUsed: number,
  successRate?: number
}
```

### Task Data Model
```typescript
{
  title: string,
  priority: 'must-do' | 'want-to',
  completed: boolean,
  createdAt: Date,
  completedAt?: Date,
  energyLevelAtCompletion?: 1-10
}
```

## Next Steps (Phase 3+)

### Analytics & Insights
- [ ] Energy pattern visualization (charts, heatmaps showing trends)
- [ ] Weekly pattern analytics and insights
- [ ] Task completion correlation with energy levels
- [ ] Intervention effectiveness analytics

### Advanced Features
- [ ] Impact-Effort Matrix for task prioritization
- [ ] AI task breakdown (Magic ToDo style - break big tasks into steps)
- [ ] N-of-1 experiment framework for systematic intervention testing
- [ ] Time-of-day optimization based on chronotype detection
- [ ] Contextual prompt system (surface if-then plans automatically)
- [ ] Distraction capture feature (quick notepad)
- [ ] Modified Pomodoro timer (flexible work blocks)

## Evidence Base

This app is built on research-backed ADHD management strategies:

- **Implementation Intentions**: Gollwitzer & Sheeran (2006) - if-then planning improves ADHD performance to neurotypical levels
- **Dopamine-Conscious Design**: Volkow et al. (2009) - ADHD individuals have 30-40% fewer D2/D3 dopamine receptors
- **Evening Chronotype**: 73-78% of ADHD adults have delayed circadian rhythm (Coogan & McGowan, 2017)
- **External Working Memory**: ADHD brains are 4x more likely to have memory problems (Barkley, 2012)
- **Immediate Feedback**: Critical for dopamine-deficient brains (Tripp & Wickens, 2008)

See `adhd-productivity-app-guide.md` for full research citations and design rationale.

## Contributing

This is a personal ADHD productivity tool. Feel free to fork and customize for your own needs!

## License

ISC

---

**Built with ADHD-friendly design: minimal friction, maximum dopamine, complete privacy.**
