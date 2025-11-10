import { useState } from 'react';
import { Intervention, DEFAULT_INTERVENTIONS } from '../../types';
import './InterventionTracker.css';

interface InterventionTrackerProps {
  onSubmit: (selectedInterventions: string[]) => void;
  selectedInterventions?: string[];
}

export function InterventionTracker({
  onSubmit,
  selectedInterventions: initialSelected = [],
}: InterventionTrackerProps) {
  const [selected, setSelected] = useState<string[]>(initialSelected);

  const toggleIntervention = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    onSubmit(selected);
  };

  // Group interventions by category
  const groupedInterventions = DEFAULT_INTERVENTIONS.reduce((acc, intervention) => {
    if (!acc[intervention.category]) {
      acc[intervention.category] = [];
    }
    acc[intervention.category].push(intervention);
    return acc;
  }, {} as Record<string, Intervention[]>);

  const categoryInfo = {
    appetizer: {
      title: '🍿 Appetizers',
      description: '5-min dopamine boost before starting',
    },
    entree: {
      title: '🍽️ Entrees',
      description: 'Sustained engagement activities',
    },
    side: {
      title: '🥗 Sides',
      description: 'Do concurrently while working',
    },
    dessert: {
      title: '🍰 Desserts',
      description: 'Rewards after completing tasks',
    },
  };

  return (
    <div className="intervention-tracker">
      <div className="intervention-tracker__header">
        <h2>What's helping you focus?</h2>
        <p className="intervention-tracker__subtitle">
          Select interventions you're using (tap to toggle)
        </p>
      </div>

      <div className="intervention-tracker__categories">
        {Object.entries(groupedInterventions).map(([category, interventions]) => (
          <div key={category} className="intervention-category">
            <div className="intervention-category__header">
              <h3>{categoryInfo[category as keyof typeof categoryInfo].title}</h3>
              <p className="intervention-category__description">
                {categoryInfo[category as keyof typeof categoryInfo].description}
              </p>
            </div>

            <div className="intervention-category__grid">
              {interventions.map((intervention) => (
                <button
                  key={intervention.id}
                  className={`intervention-card ${
                    selected.includes(intervention.id) ? 'active' : ''
                  }`}
                  onClick={() => toggleIntervention(intervention.id)}
                  type="button"
                >
                  <span className="intervention-card__icon">{intervention.icon}</span>
                  <span className="intervention-card__name">{intervention.name}</span>
                  {selected.includes(intervention.id) && (
                    <span className="intervention-card__check">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selected.length > 0 && (
        <div className="intervention-tracker__summary">
          <p>
            <strong>{selected.length}</strong> intervention{selected.length !== 1 ? 's' : ''}{' '}
            selected
          </p>
        </div>
      )}

      <button
        className="intervention-tracker__submit"
        onClick={handleSubmit}
        disabled={selected.length === 0}
      >
        {selected.length === 0
          ? 'Select at least one intervention'
          : 'Save Interventions'}
      </button>

      <p className="intervention-tracker__hint">
        Track what works to discover your personal productivity boosters
      </p>
    </div>
  );
}
