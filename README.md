# ADHD Focus - MVP

A lightning-fast productivity app designed specifically for ADHD brains.

## Quick Start (< 30 seconds)

1. Open `index.html` in your browser
2. Rate your energy level
3. Add a task
4. Check it off and celebrate! 🎉

That's it. No signup, no configuration, no friction.

## Phase 1 MVP Features

✅ **Lightning-fast task capture** (< 3 seconds)
- Single input field, always visible
- Enter key to add
- Auto-focus on page load

✅ **Today view** (3-5 tasks max visible)
- Shows only your top 5 tasks to avoid overwhelm
- Hidden tasks tracked but out of sight
- Focus on what matters NOW

✅ **Immediate celebration**
- Satisfying checkmark animation
- Random celebration messages
- Confetti explosion (because your brain needs that dopamine!)

✅ **Basic energy tracking**
- Simple 1-10 slider
- Tracks with timestamp and time of day
- Stored for future pattern analysis

✅ **Local-first storage**
- Everything stored in IndexedDB
- Works completely offline
- Your data never leaves your device
- No account needed

## Why These Design Choices?

Based on neuroscience research about ADHD brains:

- **Dopamine deficits**: Immediate celebration provides the reward your brain needs to wire habits
- **Working memory issues**: External storage means you don't have to hold tasks in your head
- **Executive function**: Low friction design (3 clicks max) reduces the cognitive load to get started
- **Overwhelm avoidance**: Only 5 tasks visible prevents decision paralysis
- **Time blindness**: Timestamps help externalize time awareness

## Using It

**Add tasks**: Just type and hit Enter. No required fields, no categories, no friction.

**Complete tasks**: Click the checkbox. Enjoy the celebration!

**Track energy**: Slide the energy bar whenever you think about it. Don't stress about being consistent - any data is better than no data.

## What's NOT in the MVP (by design)

❌ Streaks (they cause shame when broken)
❌ Notifications (default to off, avoid overwhelm)
❌ Complex scheduling (comes in Phase 2)
❌ Social features (optional in Phase 4)
❌ Gamification (optional, Phase 3)

## Technical Details

- **Pure HTML/CSS/JavaScript** - No build process, no dependencies
- **Progressive enhancement** - Works immediately, enhances with features
- **IndexedDB** - Full offline support, persistent storage
- **Mobile-responsive** - Works on any device

## Future Phases (Not in MVP)

- Phase 2: Pattern recognition and analytics
- Phase 3: Interventions and experiments
- Phase 4: Time blocking and advanced features
- Phase 5: Polish and optimization

## Testing This

Open `index.html` and try:
1. Adding 6+ tasks (notice only 5 show)
2. Completing a task (watch the celebration)
3. Adjusting energy level
4. Closing and reopening (data persists)

The goal: Can you capture a task in under 3 seconds? That's the litmus test.
