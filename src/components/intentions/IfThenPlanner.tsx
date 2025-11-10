import { useState } from 'react';
import { IfThenPlan, DEFAULT_IF_THEN_TEMPLATES } from '../../types';
import './IfThenPlanner.css';

interface IfThenPlannerProps {
  onSave: (plan: Omit<IfThenPlan, 'id'>) => void;
  existingPlans?: IfThenPlan[];
}

type Category = IfThenPlan['category'];

const CATEGORY_INFO: Record<Category, { emoji: string; label: string; color: string }> = {
  'task-initiation': { emoji: '🚀', label: 'Task Initiation', color: '#3b82f6' },
  'distraction-management': { emoji: '🎯', label: 'Distraction Management', color: '#8b5cf6' },
  'energy-boost': { emoji: '⚡', label: 'Energy Boost', color: '#f59e0b' },
  routine: { emoji: '🔄', label: 'Routine', color: '#10b981' },
  custom: { emoji: '✨', label: 'Custom', color: '#6b7280' },
};

export function IfThenPlanner({ onSave, existingPlans = [] }: IfThenPlannerProps) {
  const [mode, setMode] = useState<'browse' | 'create'>('browse');
  const [trigger, setTrigger] = useState('');
  const [action, setAction] = useState('');
  const [category, setCategory] = useState<Category>('task-initiation');
  const [showTemplates, setShowTemplates] = useState(true);

  const handleSaveCustom = () => {
    if (!trigger.trim() || !action.trim()) return;

    onSave({
      trigger: trigger.trim(),
      action: action.trim(),
      category,
      isActive: true,
      createdAt: new Date(),
      timesUsed: 0,
    });

    // Reset form
    setTrigger('');
    setAction('');
    setMode('browse');
  };

  const handleUseTemplate = (template: typeof DEFAULT_IF_THEN_TEMPLATES[0]) => {
    onSave({
      trigger: template.trigger,
      action: template.action,
      category: template.category,
      isActive: true,
      createdAt: new Date(),
      timesUsed: 0,
    });
  };

  // Filter out templates that already exist as plans
  const availableTemplates = DEFAULT_IF_THEN_TEMPLATES.filter(
    (template) =>
      !existingPlans.some(
        (plan) => plan.trigger === template.trigger && plan.action === template.action
      )
  );

  if (mode === 'create') {
    return (
      <div className="if-then-planner">
        <div className="if-then-planner__header">
          <button
            className="if-then-planner__back"
            onClick={() => setMode('browse')}
            type="button"
          >
            ← Back
          </button>
          <h2>Create If-Then Plan</h2>
        </div>

        <div className="if-then-planner__info-box">
          <p>
            <strong>Implementation intentions</strong> shift from effortful control to automatic
            behavior. Research shows they improve ADHD performance to neurotypical levels.
          </p>
        </div>

        {/* Category selection */}
        <div className="if-then-form__section">
          <label className="if-then-form__label">Category</label>
          <div className="if-then-form__category-grid">
            {(Object.keys(CATEGORY_INFO) as Category[])
              .filter((c) => c !== 'custom')
              .map((cat) => (
                <button
                  key={cat}
                  className={`category-button ${category === cat ? 'active' : ''}`}
                  onClick={() => setCategory(cat)}
                  type="button"
                  style={
                    category === cat
                      ? { borderColor: CATEGORY_INFO[cat].color, background: `${CATEGORY_INFO[cat].color}15` }
                      : {}
                  }
                >
                  <span className="category-button__emoji">{CATEGORY_INFO[cat].emoji}</span>
                  <span className="category-button__label">{CATEGORY_INFO[cat].label}</span>
                </button>
              ))}
          </div>
        </div>

        {/* Trigger input */}
        <div className="if-then-form__section">
          <label className="if-then-form__label" htmlFor="trigger">
            IF (Situational Trigger)
          </label>
          <input
            id="trigger"
            type="text"
            className="if-then-form__input"
            placeholder="e.g., I sit at my desk in the morning"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
          />
          <p className="if-then-form__hint">What situation will trigger this action?</p>
        </div>

        {/* Action input */}
        <div className="if-then-form__section">
          <label className="if-then-form__label" htmlFor="action">
            THEN (Planned Action)
          </label>
          <input
            id="action"
            type="text"
            className="if-then-form__input"
            placeholder="e.g., I will review my top 3 priorities for 2 minutes"
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
          <p className="if-then-form__hint">What specific action will you take?</p>
        </div>

        {/* Preview */}
        {trigger && action && (
          <div className="if-then-form__preview">
            <div className="if-then-plan-card">
              <span className="if-then-plan-card__emoji">{CATEGORY_INFO[category].emoji}</span>
              <div className="if-then-plan-card__content">
                <p className="if-then-plan-card__text">
                  <strong>If</strong> {trigger}
                </p>
                <p className="if-then-plan-card__text">
                  <strong>Then</strong> {action}
                </p>
              </div>
            </div>
          </div>
        )}

        <button
          className="if-then-planner__submit"
          onClick={handleSaveCustom}
          disabled={!trigger.trim() || !action.trim()}
        >
          Save If-Then Plan
        </button>
      </div>
    );
  }

  return (
    <div className="if-then-planner">
      <div className="if-then-planner__header">
        <h2>If-Then Plans</h2>
        <p className="if-then-planner__subtitle">
          Create automatic behavioral responses to situations
        </p>
      </div>

      {availableTemplates.length > 0 && showTemplates && (
        <div className="if-then-templates">
          <div className="if-then-templates__header">
            <h3>Quick Start Templates</h3>
            <button
              className="if-then-templates__hide"
              onClick={() => setShowTemplates(false)}
              type="button"
            >
              Hide
            </button>
          </div>

          <div className="if-then-templates__grid">
            {availableTemplates.map((template, index) => (
              <div key={index} className="if-then-template-card">
                <div className="if-then-template-card__header">
                  <span className="if-then-template-card__emoji">
                    {CATEGORY_INFO[template.category].emoji}
                  </span>
                  <span className="if-then-template-card__category">
                    {CATEGORY_INFO[template.category].label}
                  </span>
                </div>
                <p className="if-then-template-card__text">
                  <strong>If</strong> {template.trigger}
                </p>
                <p className="if-then-template-card__text">
                  <strong>Then</strong> {template.action}
                </p>
                <button
                  className="if-then-template-card__use"
                  onClick={() => handleUseTemplate(template)}
                  type="button"
                >
                  Use This Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {!showTemplates && availableTemplates.length > 0 && (
        <button
          className="if-then-planner__show-templates"
          onClick={() => setShowTemplates(true)}
          type="button"
        >
          Show Templates ({availableTemplates.length} available)
        </button>
      )}

      <button
        className="if-then-planner__create"
        onClick={() => setMode('create')}
        type="button"
      >
        + Create Custom Plan
      </button>

      {existingPlans.length === 0 && (
        <div className="if-then-planner__empty">
          <p>No plans yet. Start with a template or create your own!</p>
        </div>
      )}
    </div>
  );
}
