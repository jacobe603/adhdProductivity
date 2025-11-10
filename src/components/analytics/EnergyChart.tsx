import { useEffect, useRef } from 'react';
import { EnergyEntry } from '../../types';
import './EnergyChart.css';

interface EnergyChartProps {
  entries: EnergyEntry[];
  title?: string;
}

export function EnergyChart({ entries, title = 'Energy Levels by Time of Day' }: EnergyChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Group entries by time of day and calculate averages
  const getAveragesByTimeOfDay = () => {
    const groups: Record<string, number[]> = {
      morning: [],
      'mid-morning': [],
      afternoon: [],
      'late-afternoon': [],
      evening: [],
    };

    entries.forEach((entry) => {
      groups[entry.timeOfDay].push(entry.energyLevel);
    });

    return Object.entries(groups).map(([timeOfDay, levels]) => ({
      timeOfDay,
      average: levels.length > 0 ? levels.reduce((a, b) => a + b, 0) / levels.length : 0,
      count: levels.length,
    }));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    const data = getAveragesByTimeOfDay();
    if (data.every((d) => d.count === 0)) {
      // No data yet
      ctx.fillStyle = '#9ca3af';
      ctx.font = '16px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText('No data yet - start checking in!', rect.width / 2, rect.height / 2);
      return;
    }

    // Chart dimensions
    const padding = 40;
    const chartWidth = rect.width - padding * 2;
    const chartHeight = rect.height - padding * 2;
    const barWidth = chartWidth / data.length;

    // Draw bars
    data.forEach((item, index) => {
      if (item.count === 0) return;

      const barHeight = (item.average / 10) * chartHeight;
      const x = padding + index * barWidth;
      const y = padding + chartHeight - barHeight;

      // Color based on energy level
      const color = getEnergyColor(item.average);

      // Draw bar
      ctx.fillStyle = color;
      ctx.fillRect(x + barWidth * 0.1, y, barWidth * 0.8, barHeight);

      // Draw value on top
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 14px system-ui';
      ctx.textAlign = 'center';
      ctx.fillText(
        item.average.toFixed(1),
        x + barWidth / 2,
        y - 10
      );

      // Draw label
      ctx.fillStyle = '#6b7280';
      ctx.font = '12px system-ui';
      ctx.textAlign = 'center';
      const label = getTimeOfDayLabel(item.timeOfDay);
      ctx.fillText(label, x + barWidth / 2, rect.height - 10);

      // Draw count
      ctx.fillStyle = '#9ca3af';
      ctx.font = '10px system-ui';
      ctx.fillText(`(${item.count})`, x + barWidth / 2, rect.height - 24);
    });

    // Draw axis
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, padding + chartHeight);
    ctx.lineTo(padding + chartWidth, padding + chartHeight);
    ctx.stroke();

    // Draw y-axis labels
    ctx.fillStyle = '#6b7280';
    ctx.font = '12px system-ui';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 10; i += 2) {
      const y = padding + chartHeight - (i / 10) * chartHeight;
      ctx.fillText(i.toString(), padding - 10, y + 4);
    }
  }, [entries]);

  const getEnergyColor = (level: number): string => {
    if (level >= 8) return '#10b981'; // green
    if (level >= 6) return '#84cc16'; // lime
    if (level >= 4) return '#fbbf24'; // amber
    if (level >= 2) return '#f59e0b'; // orange
    return '#dc2626'; // red
  };

  const getTimeOfDayLabel = (timeOfDay: string): string => {
    const labels: Record<string, string> = {
      morning: 'Morning',
      'mid-morning': 'Mid-Morn',
      afternoon: 'Afternoon',
      'late-afternoon': 'Late-Aft',
      evening: 'Evening',
    };
    return labels[timeOfDay] || timeOfDay;
  };

  const averages = getAveragesByTimeOfDay();
  const hasData = averages.some((d) => d.count > 0);

  return (
    <div className="energy-chart">
      <h3 className="energy-chart__title">{title}</h3>
      {hasData && (
        <div className="energy-chart__legend">
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#10b981' }}></span>
            High (8-10)
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#84cc16' }}></span>
            Good (6-7)
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#fbbf24' }}></span>
            Okay (4-5)
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#f59e0b' }}></span>
            Low (2-3)
          </span>
          <span className="legend-item">
            <span className="legend-color" style={{ background: '#dc2626' }}></span>
            Very Low (1)
          </span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="energy-chart__canvas"
        style={{ width: '100%', height: '300px' }}
      />
      {hasData && (
        <p className="energy-chart__note">
          Numbers show average energy level. Count in parentheses.
        </p>
      )}
    </div>
  );
}
