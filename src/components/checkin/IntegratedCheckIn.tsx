import { useState } from 'react';
import { EnergyLevel, DEFAULT_INTERVENTIONS } from '../../types';
import './IntegratedCheckIn.css';

interface IntegratedCheckInProps {
  onSubmit: (data: CheckInData) => Promise<void>;
  lastCheckIn?: {
    energyLevel: EnergyLevel;
    timestamp: Date;
    interventions: string[];
  };
}

export interface CheckInData {
  energyLevel: EnergyLevel;
  activeInterventions: string[];
  notes?: string;
  // If this is a follow-up, include before state
  previousEnergyLevel?: EnergyLevel;
  previousInterventions?: string[];
}

// Energy level to emoji mapping
const ENERGY_EMOJIS: Record<EnergyLevel, string> = {
  1: '😴', 2: '😪', 3: '😔', 4: '😐', 5: '🙂',
  6: '😊', 7: '😄', 8: '🤩', 9: '🚀', 10: '⚡',
};

const ENERGY_LABELS: Record<EnergyLevel, string> = {
  1: 'Exhausted', 2: 'Very Low', 3: 'Low', 4: 'Below Average', 5: 'Okay',
  6: 'Good', 7: 'Great', 8: 'Energized', 9: 'Peak', 10: 'Unstoppable',
};

export function IntegratedCheckIn({ onSubmit, lastCheckIn }: IntegratedCheckInProps) {
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(5);
  const [selectedInterventions, setSelectedInterventions] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if this is a follow-up (within 2 hours of last check-in)
  const isFollowUp = lastCheckIn &&
    (new Date().getTime() - lastCheckIn.timestamp.getTime()) < 2 * 60 * 60 * 1000;

  const toggleIntervention = (id: string) => {
    setSelectedInterventions((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        energyLevel,
        activeInterventions: selectedInterventions,
        notes: notes || undefined,
        ...(isFollowUp && {
          previousEnergyLevel: lastCheckIn.energyLevel,
          previousInterventions: lastCheckIn.interventions,
        }),
      });

      // Reset form
      setNotes('');
      setShowNotes(false);
      setSelectedInterventions([]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="integrated-checkin">
      <div className="checkin-header">
        <h2>How are you doing right now?</h2>
        {isFollowUp && (
          <div className="checkin-followup-notice">
            <span className="followup-icon">🔄</span>
            <span>Follow-up check-in - we'll compare to your last entry</span>
          </div>
        )}
      </div>

      {/* Energy Level */}
      <section className="checkin-section">
        <h3 className="checkin-section-title">Energy Level</h3>

        <div className="checkin-energy-display">
          <span className="checkin-emoji">{ENERGY_EMOJIS[energyLevel]}</span>
          <div className="checkin-energy-info">
            <span className="checkin-energy-label">{ENERGY_LABELS[energyLevel]}</span>
            <span className="checkin-energy-number">{energyLevel}/10</span>
          </div>
          {isFollowUp && lastCheckIn && (
            <div className="energy-change">
              {energyLevel > lastCheckIn.energyLevel && (
                <span className="energy-up">↑ +{energyLevel - lastCheckIn.energyLevel}</span>
              )}
              {energyLevel < lastCheckIn.energyLevel && (
                <span className="energy-down">↓ {energyLevel - lastCheckIn.energyLevel}</span>
              )}
              {energyLevel === lastCheckIn.energyLevel && (
                <span className="energy-same">→ No change</span>
              )}
            </div>
          )}
        </div>

        <input
          type="range"
          min="1"
          max="10"
          value={energyLevel}
          onChange={(e) => setEnergyLevel(parseInt(e.target.value) as EnergyLevel)}
          className="checkin-slider"
        />

        {/* Quick energy markers */}
        <div className="checkin-quick-markers">
          {([1, 3, 5, 7, 10] as EnergyLevel[]).map((level) => (
            <button
              key={level}
              className={`quick-marker ${energyLevel === level ? 'active' : ''}`}
              onClick={() => setEnergyLevel(level)}
              type="button"
            >
              {ENERGY_EMOJIS[level]}
            </button>
          ))}
        </div>
      </section>

      {/* Active Interventions */}
      <section className="checkin-section">
        <h3 className="checkin-section-title">
          What's helping you right now?
          <span className="checkin-optional">(optional)</span>
        </h3>

        <div className="checkin-interventions-grid">
          {DEFAULT_INTERVENTIONS.map((intervention) => (
            <button
              key={intervention.id}
              className={`intervention-chip ${
                selectedInterventions.includes(intervention.id) ? 'active' : ''
              }`}
              onClick={() => toggleIntervention(intervention.id)}
              type="button"
            >
              <span className="intervention-chip-icon">{intervention.icon}</span>
              <span className="intervention-chip-name">{intervention.name}</span>
            </button>
          ))}
        </div>

        {selectedInterventions.length > 0 && (
          <div className="selected-count">
            {selectedInterventions.length} intervention{selectedInterventions.length !== 1 ? 's' : ''} selected
          </div>
        )}
      </section>

      {/* Optional Notes */}
      <section className="checkin-section">
        {!showNotes ? (
          <button
            className="checkin-notes-toggle"
            onClick={() => setShowNotes(true)}
            type="button"
          >
            + Add note (optional)
          </button>
        ) : (
          <div className="checkin-notes-input">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How are you feeling? What's working? Any patterns?"
              rows={3}
              className="checkin-textarea"
            />
          </div>
        )}
      </section>

      {/* Submit Button */}
      <button
        className="checkin-submit"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Saving...' : 'Save Check-In'}
      </button>

      <p className="checkin-hint">
        Check in 4-6 times daily to discover your energy patterns and what actually helps
      </p>
    </div>
  );
}
