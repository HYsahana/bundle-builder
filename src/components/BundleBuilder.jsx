import { useState } from 'react';
import productsData from '../data/products.json';
import Accordion from './Accordion';
import ProductCard from './ProductCard';
import ReviewPanel from './ReviewPanel';
import '../styles/layout.css';
import '../styles/plan-card.css';

const STORAGE_KEY = 'wyze_bundle_builder_system';

const loadConfiguration = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed &&
        typeof parsed === 'object' &&
        typeof parsed.cameras === 'object' &&
        typeof parsed.sensors === 'object' &&
        typeof parsed.extras === 'object' &&
        (typeof parsed.plan === 'string' || parsed.plan === null)
      ) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read saved system from localStorage:', e);
  }

  const initialState = {
    cameras: {},
    plan: productsData.initialState.selectedPlanId || null,
    sensors: {},
    extras: {},
    selectedColors: {}
  };

  productsData.initialState.items.forEach(item => {
    let stepId = null;
    for (const step of productsData.steps) {
      if (step.products.some(p => p.id === item.productId)) {
        stepId = step.id;
        break;
      }
    }
    if (stepId && initialState[stepId]) {
      const key = item.colorId ? `${item.productId}-${item.colorId}` : item.productId;
      initialState[stepId][key] = item.quantity;
    }
  });

  return initialState;
};

export default function BundleBuilder() {
  const [activeStepId, setActiveStepId] = useState(productsData.steps[0]?.id || 'cameras');

  // Unified configuration state
  const [configuration, setConfiguration] = useState(loadConfiguration);

  const handleStepClick = (stepId) => {
    setActiveStepId((prev) => (prev === stepId ? null : stepId));
  };

  const handleNextClick = (nextStepId) => {
    setActiveStepId(nextStepId);
  };

  const saveSystem = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configuration));
      return true;
    } catch (error) {
      console.error('Failed to save configuration to localStorage:', error);
      return false;
    }
  };

  // State updaters
  const handleIncrease = (stepId, productId, colorId = null) => {
    setConfiguration(prev => {
      const key = colorId ? `${productId}-${colorId}` : productId;
      const currentQty = prev[stepId][key] || 0;
      return {
        ...prev,
        [stepId]: {
          ...prev[stepId],
          [key]: currentQty + 1
        }
      };
    });
  };

  const handleDecrease = (stepId, productId, colorId = null) => {
    setConfiguration(prev => {
      const key = colorId ? `${productId}-${colorId}` : productId;
      const currentQty = prev[stepId][key] || 0;
      if (currentQty <= 0) return prev;

      const newStepGroup = { ...prev[stepId] };
      if (currentQty === 1) {
        delete newStepGroup[key];
      } else {
        newStepGroup[key] = currentQty - 1;
      }

      return {
        ...prev,
        [stepId]: newStepGroup
      };
    });
  };

  const handleSelectColor = (productId, colorId) => {
    setConfiguration(prev => ({
      ...prev,
      selectedColors: {
        ...prev.selectedColors,
        [productId]: colorId
      }
    }));
  };

  const handleSelectPlan = (planId) => {
    setConfiguration(prev => ({ ...prev, plan: planId }));
  };

  // Helper for "N selected"
  const getSelectedCount = (stepId) => {
    if (stepId === 'plan') return configuration.plan ? 1 : 0;
    const group = configuration[stepId] || {};
    const step = productsData.steps.find((s) => s.id === stepId);
    return step.products.filter((p) =>
      Object.keys(group).some(
        (k) => k === p.id || p.colors?.some((c) => `${p.id}-${c.id}` === k)
      )
    ).length;
  };

  // Render content for each step
  const renderStepContent = (step) => {
    if (step.id === 'plan') {
      return (
        <div className="plan-grid">
          {step.products.map((product) => {
            const isSelected = configuration.plan === product.id;
            return (
              <button 
                type="button"
                key={product.id} 
                className={`plan-card ${isSelected ? 'plan-card--selected' : ''}`}
                onClick={() => handleSelectPlan(product.id)}
                aria-pressed={isSelected}
              >
                <div className="plan-card-header">
                  {product.badge && <span className="plan-card-badge">{product.badge}</span>}
                  <img src={product.image} alt={product.name} className="plan-card-icon" />
                  <h3 className="plan-card-title">{product.name}</h3>
                </div>
                <p className="plan-card-description">{product.description}</p>
                <div className="plan-card-pricing">
                  {product.oldPrice && <span className="plan-card-old-price">${product.oldPrice.toFixed(2)}{product.billingPeriod}</span>}
                  <span className="plan-card-price">${product.price.toFixed(2)}{product.billingPeriod}</span>
                </div>
              </button>
            );
          })}
        </div>
      );
    }

    return (
      <div className={`${step.id}-grid`}>
        {step.products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            stepId={step.id}
            configuration={configuration}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            onSelectColor={handleSelectColor}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="bundle-builder-container">
      <header className="bundle-builder-header">
        <h1 className="bundle-builder-main-title">Let's get started!</h1>
      </header>

      <main className="bundle-builder-layout">
        <section className="bundle-builder-main">
          <Accordion
            steps={productsData.steps}
            activeStepId={activeStepId}
            onStepClick={handleStepClick}
            onNextClick={handleNextClick}
            renderStepContent={renderStepContent}
            getSelectedCount={getSelectedCount}
          />
        </section>

        <div className="bundle-builder-sidebar">
          <ReviewPanel 
            configuration={configuration}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            saveSystem={saveSystem}
          />
        </div>
      </main>
    </div>
  );
}
