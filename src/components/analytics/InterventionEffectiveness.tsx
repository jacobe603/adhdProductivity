import { CheckInEntry, DEFAULT_INTERVENTIONS } from '../../types';
import './InterventionEffectiveness.css';

interface InterventionEffectivenessProps {
  checkIns: CheckInEntry[];
}

interface InterventionStats {
  id: string;
  name: string;
  icon: string;
  timesUsed: number;
  avgEnergyBefore: number;
  avgEnergyAfter: number;
  energyChange: number;
  effectiveness: 'very-effective' | 'effective' | 'neutral' | 'not-effective';
}

export function InterventionEffectiveness({ checkIns }: InterventionEffectivenessProps) {
  const calculateStats = (): InterventionStats[] => {
    const interventionMap = new Map<string, {
      before: number[];
      after: number[];
    }>();

    // Build pairs of before/after check-ins
    for (let i = 1; i < checkIns.length; i++) {
      const current = checkIns[i];
      const previous = checkIns[i - 1];

      // Check if within 3 hours (likely a before/after pair)
      const timeDiff = current.timestamp.getTime() - previous.timestamp.getTime();
      if (timeDiff < 3 * 60 * 60 * 1000 && timeDiff > 0) {
        // Current check-in interventions
        current.activeInterventions.forEach((interventionId) => {
          if (!interventionMap.has(interventionId)) {
            interventionMap.set(interventionId, { before: [], after: [] });
          }
          const stats = interventionMap.get(interventionId)!;
          stats.before.push(previous.energyLevel);
          stats.after.push(current.energyLevel);
        });
      }
    }

    // Calculate averages and effectiveness
    const stats: InterventionStats[] = [];

    DEFAULT_INTERVENTIONS.forEach((intervention) => {
      const data = interventionMap.get(intervention.id);
      if (data && data.before.length > 0) {
        const avgBefore = data.before.reduce((a, b) => a + b, 0) / data.before.length;
        const avgAfter = data.after.reduce((a, b) => a + b, 0) / data.after.length;
        const change = avgAfter - avgBefore;

        let effectiveness: InterventionStats['effectiveness'];
        if (change >= 2) effectiveness = 'very-effective';
        else if (change >= 0.5) effectiveness = 'effective';
        else if (change >= -0.5) effectiveness = 'neutral';
        else effectiveness = 'not-effective';

        stats.push({
          id: intervention.id,
          name: intervention.name,
          icon: intervention.icon,
          timesUsed: data.before.length,
          avgEnergyBefore: avgBefore,
          avgEnergyAfter: avgAfter,
          energyChange: change,
          effectiveness,
        });
      }
    });

    // Sort by effectiveness (energy change)
    return stats.sort((a, b) => b.energyChange - a.energyChange);
  };

  const stats = calculateStats();

  if (stats.length === 0) {
    return (
      <div className="intervention-effectiveness">
        <h3 className="effectiveness__title">Intervention Effectiveness</h3>
        <div className="effectiveness__empty">
          <p className="effectiveness__empty-icon">📊</p>
          <p className="effectiveness__empty-text">Not enough data yet</p>
          <p className="effectiveness__empty-subtext">
            Check in multiple times with interventions to see what works!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="intervention-effectiveness">
      <h3 className="effectiveness__title">What's Actually Working for You</h3>
      <p className="effectiveness__subtitle">
        Based on your energy levels before and after using interventions
      </p>

      <div className="effectiveness-list">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`effectiveness-card ${stat.effectiveness}`}
          >
            <div className="effectiveness-card__header">
              <span className="effectiveness-card__icon">{stat.icon}</span>
              <div className="effectiveness-card__info">
                <h4 className="effectiveness-card__name">{stat.name}</h4>
                <p className="effectiveness-card__usage">
                  Used {stat.timesUsed} time{stat.timesUsed !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="effectiveness-card__stats">
              <div className="stat">
                <span className="stat-label">Before</span>
                <span className="stat-value before">
                  {stat.avgEnergyBefore.toFixed(1)}
                </span>
              </div>

              <div className="stat-arrow">
                {stat.energyChange > 0 && <span className="arrow up">↑</span>}
                {stat.energyChange < 0 && <span className="arrow down">↓</span>}
                {stat.energyChange === 0 && <span className="arrow same">→</span>}
              </div>

              <div className="stat">
                <span className="stat-label">After</span>
                <span className="stat-value after">
                  {stat.avgEnergyAfter.toFixed(1)}
                </span>
              </div>
            </div>

            <div className="effectiveness-card__change">
              <span className={`change-badge ${stat.energyChange >= 0 ? 'positive' : 'negative'}`}>
                {stat.energyChange >= 0 ? '+' : ''}
                {stat.energyChange.toFixed(1)} energy
              </span>
              <span className="effectiveness-badge">
                {stat.effectiveness === 'very-effective' && '🌟 Very Effective'}
                {stat.effectiveness === 'effective' && '✓ Effective'}
                {stat.effectiveness === 'neutral' && '○ Neutral'}
                {stat.effectiveness === 'not-effective' && '✗ Not Helpful'}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="effectiveness-note">
        <p>
          💡 <strong>Tip:</strong> Focus on interventions that consistently boost your energy.
          Don't be afraid to drop things that aren't working for you!
        </p>
      </div>
    </div>
  );
}
