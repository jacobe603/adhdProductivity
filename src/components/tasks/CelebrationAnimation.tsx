import { useEffect, useState } from 'react';
import './CelebrationAnimation.css';

interface CelebrationAnimationProps {
  show: boolean;
  onComplete: () => void;
}

// Celebration messages for dopamine boost!
const CELEBRATION_MESSAGES = [
  '🎉 Awesome!',
  '⭐ You did it!',
  '🚀 Great job!',
  '💪 Crushing it!',
  '✨ Amazing!',
  '🔥 On fire!',
  '🎯 Nailed it!',
  '💫 Fantastic!',
  '🌟 Well done!',
  '⚡ Boom!',
];

export function CelebrationAnimation({ show, onComplete }: CelebrationAnimationProps) {
  const [message] = useState(
    () => CELEBRATION_MESSAGES[Math.floor(Math.random() * CELEBRATION_MESSAGES.length)]
  );

  useEffect(() => {
    if (show) {
      // Duration matches CSS animation
      const timer = setTimeout(onComplete, 1500);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="celebration-overlay">
      <div className="celebration-content">
        <div className="celebration-message">{message}</div>
        {/* Confetti particles */}
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.3}s`,
              '--rotation': `${Math.random() * 360}deg`,
            } as React.CSSProperties}
          />
        ))}
      </div>
    </div>
  );
}
