// Utility functions for time-of-day categorization
// Based on ADHD research - evening chronotype optimization

export type TimeOfDay = 'morning' | 'mid-morning' | 'afternoon' | 'late-afternoon' | 'evening';

/**
 * Determines time of day category based on hour
 * Aligned with ADHD evening chronotype patterns:
 * - Morning: 6-9 AM (often low energy for ADHD)
 * - Mid-morning: 9-12 PM (building energy, medication kicking in)
 * - Afternoon: 12-4 PM (peak focus for evening chronotypes)
 * - Late afternoon: 4-7 PM (energy declining, medication wearing off)
 * - Evening: 7-11 PM (can be creative/productive for evening types)
 */
export function getTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours();

  if (hour >= 6 && hour < 9) return 'morning';
  if (hour >= 9 && hour < 12) return 'mid-morning';
  if (hour >= 12 && hour < 16) return 'afternoon';
  if (hour >= 16 && hour < 19) return 'late-afternoon';
  return 'evening'; // 7 PM - 6 AM
}

/**
 * Gets a friendly display name for time of day
 */
export function getTimeOfDayDisplay(timeOfDay: TimeOfDay): string {
  const displays: Record<TimeOfDay, string> = {
    morning: 'Morning (6-9 AM)',
    'mid-morning': 'Mid-Morning (9 AM-12 PM)',
    afternoon: 'Afternoon (12-4 PM)',
    'late-afternoon': 'Late Afternoon (4-7 PM)',
    evening: 'Evening (7 PM+)',
  };
  return displays[timeOfDay];
}

/**
 * Gets emoji for time of day
 */
export function getTimeOfDayEmoji(timeOfDay: TimeOfDay): string {
  const emojis: Record<TimeOfDay, string> = {
    morning: '🌅',
    'mid-morning': '☀️',
    afternoon: '🌞',
    'late-afternoon': '🌤️',
    evening: '🌙',
  };
  return emojis[timeOfDay];
}

/**
 * Format timestamp for display
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Format date for display
 */
export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format relative time (e.g., "2 hours ago", "yesterday")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;

  return formatDate(date);
}
