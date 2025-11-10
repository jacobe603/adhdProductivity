import { useState } from 'react';
import { EnergyLevel } from '../../types';
import './EnergyTracker.css';

interface EnergyTrackerProps {
  onSubmit: (energyLevel: EnergyLevel, notes?: string) => void;
  initialValue?: EnergyLevel;
}

// Energy level to emoji mapping - visual, immediate feedback
const ENERGY_EMOJIS: Record<EnergyLevel, string> = {
  1: '😴',
  2: '😪',
  3: '😔',
  4: '😐',
  5: '🙂',
  6: '😊',
  7: '😄',
  8: '🤩',
  9: '🚀',
  10: '⚡',
};

const ENERGY_LABELS: Record<EnergyLevel, string> = {
  1: 'Exhausted',
  2: 'Very Low',
  3: 'Low',
  4: 'Below Average',
  5: 'Okay',
  6: 'Good',
  7: 'Great',
  8: 'Energized',
  9: 'Peak',
  10: 'Unstoppable',
};

const ENERGY_COLORS: Record<EnergyLevel, string> = {
  1: '#dc2626', // red-600
  2: '#ea580c', // orange-600
  3: '#f59e0b', // amber-500
  4: '#fbbf24', // amber-400
  5: '#fcd34d', // amber-300
  6: '#a3e635', // lime-400
  7: '#84cc16', // lime-500
  8: '#4ade80', // green-400
  9: '#22c55e', // green-500
  10: '#10b981', // emerald-500
};

export function EnergyTracker({ onSubmit, initialValue = 5 }: EnergyTrackerProps) {
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(initialValue);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);

  const handleSubmit = () => {
    onSubmit(energyLevel, notes || undefined);
    // Reset for next entry
    setNotes('');
    setShowNotes(false);
  };

  return (
    <div className="energy-tracker">
      <div className="energy-tracker__header">
        <h2>How's your energy right now?</h2>
      </div>

      {/* Large emoji display - immediate visual feedback */}
      <div
        className="energy-tracker__emoji-display"
        style={{ color: ENERGY_COLORS[energyLevel] }}
      >
        <span className="energy-tracker__emoji">{ENERGY_EMOJIS[energyLevel]}</span>
        <span className="energy-tracker__label">{ENERGY_LABELS[energyLevel]}</span>
        <span className="energy-tracker__number">{energyLevel}/10</span>
      </div>

      {/* Slider with emoji markers */}
      <div className="energy-tracker__slider-container">
        <input
          type="range"
          min="1"
          max="10"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(parseInt(e.target.value) as EnergyLevel)}
          className="energy-tracker__slider"
          style={{
            background: `linear-gradient(to right,
              #dc2626 0%,
              #ea580c 11%,
              #f59e0b 22%,
              #fbbf24 33%,
              #fcd34d 44%,
              #a3e635 55%,
              #84cc16 66%,
              #4ade80 77%,
              #22c55e 88%,
              #10b981 100%)`,
          }}
        />

        {/* Emoji markers along slider */}
        <div className="energy-tracker__emoji-markers">
          {([1, 3, 5, 7, 10] as EnergyLevel[]).map((level) => (
            <button
              key={level}
              className={`energy-tracker__emoji-marker ${
                energyLevel === level ? 'active' : ''
              }`}
              onClick={() => setEnergyLevel(level)}
              type="button"
            >
              {ENERGY_EMOJIS[level]}
            </button>
          ))}
        </div>
      </div>

      {/* Optional notes toggle */}
      <div className="energy-tracker__notes-section">
        {!showNotes ? (
          <button
            className="energy-tracker__notes-toggle"
            onClick={() => setShowNotes(true)}
            type="button"
          >
            + Add note (optional)
          </button>
        ) : (
          <div className="energy-tracker__notes-input">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="What's affecting your energy? (sleep, stress, excitement, etc.)"
              rows={3}
              className="energy-tracker__textarea"
            />
            <button
              className="energy-tracker__notes-close"
              onClick={() => {
                setShowNotes(false);
                setNotes('');
              }}
              type="button"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Primary CTA - large and prominent */}
      <button
        className="energy-tracker__submit"
        onClick={handleSubmit}
        style={{ backgroundColor: ENERGY_COLORS[energyLevel] }}
      >
        Save Energy Check-in
      </button>

      <p className="energy-tracker__hint">
        Check in 4-6 times daily to discover your patterns
      </p>
    </div>
  );
}
