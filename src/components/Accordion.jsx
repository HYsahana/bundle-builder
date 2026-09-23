import {
  CameraIcon,
  ShieldIcon,
  SensorIcon,
  ProtectionIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from './Icons';
import '../styles/accordion.css';

const STEP_ICONS = {
  cameras: CameraIcon,
  plan: ShieldIcon,
  sensors: SensorIcon,
  extras: ProtectionIcon,
};

export default function Accordion({
  steps,
  activeStepId,
  onStepClick,
  onNextClick,
  renderStepContent,
  getSelectedCount,
}) {
  return (
    <div className="accordion-container">
      {steps.map((step, index) => {
        const isOpen = activeStepId === step.id;
        const IconComponent = STEP_ICONS[step.id] || CameraIcon;
        // The "N selected" number in each step header = number of different products that have at least one item chosen
        const selectedCount = getSelectedCount(step.id);
        const nextStep = steps[index + 1];

        return (
          <div
            key={step.id}
            className={`accordion-step ${isOpen ? 'accordion-step--open' : ''}`}
          >
            {/* Step Meta Label always sits outside above title */}
            <div className="accordion-step-meta">
              STEP {step.stepNumber} OF {steps.length}
            </div>

            <div
              className={`accordion-step-card ${
                isOpen ? 'accordion-step-card--open' : ''
              }`}
            >
              <div className={isOpen ? 'accordion-card-content-wrap' : ''}>
                {/* Accordion Header */}
                <button
                  type="button"
                  className="accordion-header"
                  onClick={() => onStepClick(step.id)}
                  aria-expanded={isOpen}
                >
                  <div className="accordion-header-left">
                    <span className="accordion-icon-wrap">
                      <IconComponent className="accordion-icon" />
                    </span>
                    <h2 className="accordion-title">{step.title}</h2>
                  </div>

                  <div className="accordion-header-right">
                    <span className="accordion-selected-count">
                      {selectedCount} selected
                    </span>
                    <span className="accordion-arrow">
                      {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                    </span>
                  </div>
                </button>

                {/* Accordion Body */}
                {isOpen && (
                  <div className="accordion-body">
                    <div className="accordion-content">
                      {renderStepContent ? (
                        renderStepContent(step)
                      ) : (
                        <div className="accordion-placeholder">
                          Products for {step.title} will appear here.
                        </div>
                      )}
                    </div>

                    {/* Next Step Button */}
                    {nextStep && (
                      <div className="accordion-next-container">
                        <button
                          type="button"
                          className="accordion-next-btn"
                          onClick={() => onNextClick(nextStep.id)}
                        >
                          Next: {nextStep.title}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
