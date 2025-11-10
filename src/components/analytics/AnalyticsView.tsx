import { useState, useEffect } from 'react';
import { EnergyChart } from './EnergyChart';
import { InterventionEffectiveness } from './InterventionEffectiveness';
import { db } from '../../db/database';
import { EnergyEntry, CheckInEntry } from '../../types';
import './AnalyticsView.css';

export function AnalyticsView() {
  const [energyEntries, setEnergyEntries] = useState<EnergyEntry[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<7 | 14 | 30>(14);

  useEffect(() => {
    loadData();
  }, [timeRange]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [energy, checks] = await Promise.all([
        db.getEnergyEntries(timeRange),
        db.getCheckIns(timeRange),
      ]);

      setEnergyEntries(energy);
      setCheckIns(checks);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-view">
        <div className="analytics-loading">
          <div className="analytics-loading__spinner"></div>
          <p>Loading your insights...</p>
        </div>
      </div>
    );
  }

  const hasData = energyEntries.length > 0 || checkIns.length > 0;

  return (
    <div className="analytics-view">
      <div className="analytics-header">
        <h2>Your Insights</h2>
        <p className="analytics-subtitle">
          Discover patterns and what actually works for you
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="analytics-controls">
        <div className="time-range-selector">
          <button
            className={`range-button ${timeRange === 7 ? 'active' : ''}`}
            onClick={() => setTimeRange(7)}
          >
            7 Days
          </button>
          <button
            className={`range-button ${timeRange === 14 ? 'active' : ''}`}
            onClick={() => setTimeRange(14)}
          >
            14 Days
          </button>
          <button
            className={`range-button ${timeRange === 30 ? 'active' : ''}`}
            onClick={() => setTimeRange(30)}
          >
            30 Days
          </button>
        </div>
      </div>

      {!hasData ? (
        <div className="analytics-empty">
          <p className="analytics-empty__icon">📊</p>
          <h3 className="analytics-empty__title">Start tracking to see insights</h3>
          <p className="analytics-empty__text">
            Use the Check-In tab to track your energy and interventions throughout the day.
            After a few check-ins, you'll see patterns emerge here!
          </p>
          <div className="analytics-empty__tips">
            <h4>Quick Tips:</h4>
            <ul>
              <li>Check in 4-6 times daily</li>
              <li>Note which interventions you're using</li>
              <li>Track for at least 3-5 days to see meaningful patterns</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="analytics-content">
          {/* Energy Pattern Chart */}
          {energyEntries.length > 0 && (
            <div className="analytics-section">
              <EnergyChart entries={energyEntries} />
              <div className="analytics-insight">
                <p>
                  💡 <strong>Your Peak Time:</strong> {getPeakTimeInsight(energyEntries)}
                </p>
              </div>
            </div>
          )}

          {/* Intervention Effectiveness */}
          {checkIns.length > 1 && (
            <div className="analytics-section">
              <InterventionEffectiveness checkIns={checkIns} />
            </div>
          )}

          {/* Quick Stats */}
          <div className="analytics-section">
            <div className="quick-stats">
              <div className="quick-stat-card">
                <span className="quick-stat-icon">📝</span>
                <div className="quick-stat-info">
                  <span className="quick-stat-value">{checkIns.length + energyEntries.length}</span>
                  <span className="quick-stat-label">Total Check-ins</span>
                </div>
              </div>

              <div className="quick-stat-card">
                <span className="quick-stat-icon">⚡</span>
                <div className="quick-stat-info">
                  <span className="quick-stat-value">
                    {getAverageEnergy(energyEntries, checkIns).toFixed(1)}
                  </span>
                  <span className="quick-stat-label">Avg Energy</span>
                </div>
              </div>

              <div className="quick-stat-card">
                <span className="quick-stat-icon">🎯</span>
                <div className="quick-stat-info">
                  <span className="quick-stat-value">{getUniqueInterventionsCount(checkIns)}</span>
                  <span className="quick-stat-label">Interventions Tried</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper functions
function getPeakTimeInsight(entries: EnergyEntry[]): string {
  const averages: Record<string, number[]> = {
    morning: [],
    'mid-morning': [],
    afternoon: [],
    'late-afternoon': [],
    evening: [],
  };

  entries.forEach((entry) => {
    averages[entry.timeOfDay].push(entry.energyLevel);
  });

  let peakTime = '';
  let peakAvg = 0;

  Object.entries(averages).forEach(([time, levels]) => {
    if (levels.length > 0) {
      const avg = levels.reduce((a, b) => a + b, 0) / levels.length;
      if (avg > peakAvg) {
        peakAvg = avg;
        peakTime = time;
      }
    }
  });

  const timeLabels: Record<string, string> = {
    morning: 'Morning (6-9 AM)',
    'mid-morning': 'Mid-Morning (9 AM-12 PM)',
    afternoon: 'Afternoon (12-4 PM)',
    'late-afternoon': 'Late Afternoon (4-7 PM)',
    evening: 'Evening (7 PM+)',
  };

  return peakTime ? timeLabels[peakTime] || peakTime : 'Not enough data yet';
}

function getAverageEnergy(energyEntries: EnergyEntry[], checkIns: CheckInEntry[]): number {
  const allLevels = [
    ...energyEntries.map((e) => e.energyLevel),
    ...checkIns.map((c) => c.energyLevel),
  ];

  if (allLevels.length === 0) return 0;
  return allLevels.reduce((a, b) => a + b, 0) / allLevels.length;
}

function getUniqueInterventionsCount(checkIns: CheckInEntry[]): number {
  const unique = new Set<string>();
  checkIns.forEach((checkIn) => {
    checkIn.activeInterventions.forEach((id) => unique.add(id));
  });
  return unique.size;
}
