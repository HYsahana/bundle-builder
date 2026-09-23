import React from 'react';

export default function QuantityControl({ 
  quantity, 
  onIncrease, 
  onDecrease, 
  disabled = false, 
  ariaLabel = '',
  variant = 'product' // 'product' | 'review'
}) {
  const containerClass = variant === 'review' ? 'review-stepper' : 'stepper-wrap';
  const btnClass = variant === 'review' ? 'review-stepper-btn' : 'stepper-btn';
  const valClass = variant === 'review' ? 'review-stepper-val' : 'stepper-value';
  
  const disabledClass = disabled ? `${containerClass}--disabled` : '';

  return (
    <div className={`${containerClass} ${disabledClass}`}>
      <button
        type="button"
        className={`${btnClass} ${btnClass}--minus`}
        disabled={disabled || quantity <= 0}
        onClick={onDecrease}
        aria-label={`Decrease ${ariaLabel} quantity`}
      >
        -
      </button>
      <span className={valClass}>{quantity}</span>
      <button
        type="button"
        className={`${btnClass} ${btnClass}--plus`}
        disabled={disabled}
        onClick={onIncrease}
        aria-label={`Increase ${ariaLabel} quantity`}
      >
        +
      </button>
    </div>
  );
}
