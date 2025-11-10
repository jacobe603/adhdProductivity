# ADHD Productivity App

An evidence-based productivity tracking app designed specifically for ADHD brains, built with React, TypeScript, and local-first architecture.

## Phase 1 Features ✅

### 1. Energy Tracking & Visualization
- **Visual emoji slider** (1-10) for tracking energy levels throughout the day
- Time-of-day categorization (morning, mid-morning, afternoon, late-afternoon, evening)
- Optional notes for context
- Immediate visual feedback with color-coded energy states
- Large touch targets and clear visual hierarchy

### 2. If-Then Implementation Intentions
- Research-backed "if-then" planning system that improves ADHD performance to neurotypical levels
- Pre-built templates for common scenarios:
  - Task initiation
  - Distraction management
  - Energy boosts
  - Routine building
- Custom plan creation with category tagging
- Success tracking for each plan

### 3. Intervention Tracking
- **Dopamenu system** with 4 categories:
  - 🍿 **Appetizers**: 5-min dopamine boosts (walk, music, stretch)
  - 🍽️ **Entrees**: Sustained engagement (exercise, meditation)
  - 🥗 **Sides**: Concurrent activities (background music, coffee, body doubling)
  - 🍰 **Desserts**: Rewards after completion (snacks, social media, games)
- Quick-toggle interface for tracking active interventions
- Context tracking (energy before/after intervention)
- Effectiveness ratings

## ADHD-Friendly Design Principles

✓ **Minimal cognitive load**: Maximum 3 navigation tabs, single primary CTA per screen
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

## Next Steps (Phase 2 & 3)

- [ ] Energy pattern visualization (charts, heatmaps, insights)
- [ ] Contextual prompt system to surface if-then plans automatically
- [ ] N-of-1 experiment framework for testing interventions
- [ ] Time-of-day optimization based on chronotype
- [ ] Impact-Effort Matrix for task prioritization
- [ ] Distraction capture feature
- [ ] Modified Pomodoro timer
- [ ] AI task breakdown (Magic ToDo style)
- [ ] Weekly pattern analytics

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
