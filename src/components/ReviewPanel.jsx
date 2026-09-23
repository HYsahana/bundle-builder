import { useState } from 'react';
import productsData from '../data/products.json';
import { ShippingIcon, PlanShieldIcon } from './Icons';
import { getProductImage } from '../utils/imageHelper';
import QuantityControl from './QuantityControl';
import guaranteeBadgeImg from '../assets/images/guarantee-badge.png';
import '../styles/review.css';

export default function ReviewPanel({ configuration, onIncrease, onDecrease, saveSystem }) {
  const [saveMessage, setSaveMessage] = useState(null);

  // Flatten all products across steps with their stepId
  const allProductsMap = {};
  productsData.steps.forEach((step) => {
    step.products.forEach((p) => {
      allProductsMap[p.id] = { ...p, stepId: step.id };
    });
  });

  // Group items by category from configuration
  const cameraItems = [];
  const sensorItems = [];
  const accessoryItems = [];

  ['cameras', 'sensors', 'extras'].forEach(stepId => {
    const group = configuration[stepId];
    if (!group) return;

    Object.entries(group).forEach(([key, quantity]) => {
      if (quantity <= 0) return;
      
      let productId = key;
      let colorId = null;

      // We can find the product first
      let product = allProductsMap[key];
      if (!product) {
        // try extracting color
        const parts = key.split('-');
        const color = parts.pop();
        const baseId = parts.join('-');
        if (allProductsMap[baseId]) {
          productId = baseId;
          colorId = color;
          product = allProductsMap[baseId];
        }
      }

      if (!product) return;

      const activeColor = product.colors?.find((c) => c.id === colorId) || 
                          product.colors?.find((c) => c.id === configuration.selectedColors?.[product.id]);
      
      const rawThumb = activeColor?.image || product.image;
      
      let selectedVariantsCount = 0;
      Object.entries(group).forEach(([k, q]) => {
        if (q > 0 && (k === productId || k.startsWith(`${productId}-`))) {
          selectedVariantsCount++;
        }
      });
      
      let displayName = product.name;
      if (stepId === 'cameras' && selectedVariantsCount > 1 && activeColor) {
        displayName = `${product.name} · ${activeColor.label}`;
      }
      
      const itemData = {
        productId,
        colorId: activeColor?.id || null,
        quantity,
        stepId,
        product,
        color: activeColor,
        thumbnail: getProductImage(rawThumb),
        displayName,
        unitPrice: product.reviewPrice !== undefined ? product.reviewPrice : product.price,
        unitOldPrice: product.reviewOldPrice !== undefined ? product.reviewOldPrice : product.oldPrice,
      };

      if (stepId === 'cameras') cameraItems.push(itemData);
      else if (stepId === 'sensors') sensorItems.push(itemData);
      else if (stepId === 'extras') accessoryItems.push(itemData);
    });
  });

  // Selected Plan
  const planStep = productsData.steps.find((s) => s.id === 'plan');
  const selectedPlan = planStep?.products.find(
    (p) => p.id === configuration.plan
  );

  // Shipping item for display
  const shipping = productsData.shipping;

  const allItems = [...cameraItems, ...sensorItems, ...accessoryItems];

  const itemsTotal = allItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const itemsOldTotal = allItems.reduce((sum, item) => sum + (item.unitOldPrice ?? item.unitPrice) * item.quantity, 0);

  const planTotal = selectedPlan ? selectedPlan.reviewPrice ?? selectedPlan.price : 0;
  const planOldTotal = selectedPlan ? selectedPlan.reviewOldPrice ?? (selectedPlan.oldPrice ?? selectedPlan.price) : 0;

  const total = itemsTotal + planTotal;
  const oldTotal = itemsOldTotal + planOldTotal;
  const savings = Math.max(0, oldTotal - total);

  const handleCheckout = () => {
    alert(
      `🎉 Checkout Successful!\n\nOrder Total: $${total.toFixed(2)}\nYou saved: $${savings.toFixed(2)}!\n\nThank you for choosing Wyze security!`
    );
  };

  const handleSave = (e) => {
    e.preventDefault();
    const success = saveSystem();
    if (success) {
      setSaveMessage('System saved');
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }
  };

  return (
    <aside className="review-panel-wrapper" aria-label="Review your system">
      <div className="review-panel">
        <span className="review-panel-meta">REVIEW</span>
        <div className="review-panel-inner">
          <div className="review-panel-left-content">
            <div className="review-panel-header">
              <h2 className="review-panel-title">Your security system</h2>
              <p className="review-panel-subtitle">
                Review your personalized protection system designed to keep what matters most safe.
              </p>
              <div className="review-subtitle-divider" />
            </div>

            <div className="review-items-container">
              {/* 1. CAMERAS */}
              {cameraItems.length > 0 && (
                <div className="review-group">
                  <h3 className="review-group-title">CAMERAS</h3>
                  {cameraItems.map((item) => (
                    <div key={`${item.productId}-${item.colorId || 'default'}`} className="review-item-row">
                      <div className="review-item-left">
                        <img src={item.thumbnail} alt={item.displayName} className="review-item-thumb" />
                        <span className="review-item-name">{item.displayName}</span>
                      </div>
                      <div className="review-item-right">
                        <QuantityControl 
                          quantity={item.quantity}
                          onIncrease={() => onIncrease(item.stepId, item.productId, item.colorId)}
                          onDecrease={() => onDecrease(item.stepId, item.productId, item.colorId)}
                          ariaLabel={item.displayName}
                          variant="review"
                        />
                        <div className="review-item-pricing">
                          {item.unitOldPrice !== undefined && item.unitOldPrice > item.unitPrice && (
                            <span className="review-item-old-price">${(item.unitOldPrice * item.quantity).toFixed(2)}</span>
                          )}
                          <span className="review-item-price">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. SENSORS */}
              {sensorItems.length > 0 && (
                <div className="review-group">
                  <h3 className="review-group-title">SENSORS</h3>
                  {sensorItems.map((item) => {
                    const isRequired = item.product.isRequired;
                    return (
                      <div key={`${item.productId}-${item.colorId || 'default'}`} className="review-item-row">
                        <div className="review-item-left">
                          <img src={item.thumbnail} alt={item.displayName} className="review-item-thumb" />
                          <span className="review-item-name">{item.displayName}</span>
                        </div>
                        <div className="review-item-right">
                          <QuantityControl 
                            quantity={item.quantity}
                            onIncrease={() => onIncrease(item.stepId, item.productId, item.colorId)}
                            onDecrease={() => onDecrease(item.stepId, item.productId, item.colorId)}
                            disabled={isRequired}
                            ariaLabel={item.displayName}
                            variant="review"
                          />
                          <div className="review-item-pricing">
                            {item.unitOldPrice !== undefined && item.unitOldPrice > item.unitPrice && (
                              <span className="review-item-old-price">${(item.unitOldPrice * item.quantity).toFixed(2)}</span>
                            )}
                            <span className={`review-item-price ${item.unitPrice === 0 ? 'review-item-price--free' : ''}`}>
                              {item.unitPrice === 0 ? 'FREE' : `$${(item.unitPrice * item.quantity).toFixed(2)}`}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 3. ACCESSORIES */}
              {accessoryItems.length > 0 && (
                <div className="review-group">
                  <h3 className="review-group-title">ACCESSORIES</h3>
                  {accessoryItems.map((item) => (
                    <div key={`${item.productId}-${item.colorId || 'default'}`} className="review-item-row">
                      <div className="review-item-left">
                        <img src={item.thumbnail} alt={item.displayName} className="review-item-thumb" />
                        <span className="review-item-name">{item.displayName}</span>
                      </div>
                      <div className="review-item-right">
                        <QuantityControl 
                          quantity={item.quantity}
                          onIncrease={() => onIncrease(item.stepId, item.productId, item.colorId)}
                          onDecrease={() => onDecrease(item.stepId, item.productId, item.colorId)}
                          ariaLabel={item.displayName}
                          variant="review"
                        />
                        <div className="review-item-pricing">
                          {item.unitOldPrice !== undefined && item.unitOldPrice > item.unitPrice && (
                            <span className="review-item-old-price">${(item.unitOldPrice * item.quantity).toFixed(2)}</span>
                          )}
                          <span className="review-item-price">${(item.unitPrice * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 4. PLAN */}
              {selectedPlan && (
                <div className="review-group">
                  <h3 className="review-group-title">
                    <span className="review-plan-label-desktop">PLAN</span>
                    <span className="review-plan-label-phone">HOME MONITORING PLAN</span>
                  </h3>
                  <div className="review-item-row">
                    <div className="review-item-left">
                      <span className="review-plan-icon-wrap">
                        <PlanShieldIcon className="review-plan-icon" />
                      </span>
                      <span className="review-item-name review-plan-name">
                        {selectedPlan.name}
                      </span>
                    </div>
                    <div className="review-item-pricing">
                      {(selectedPlan.reviewOldPrice ?? selectedPlan.oldPrice) && (
                        <span className="review-item-old-price">${(selectedPlan.reviewOldPrice ?? selectedPlan.oldPrice).toFixed(2)}/mo</span>
                      )}
                      <span className="review-item-price">${(selectedPlan.reviewPrice ?? selectedPlan.price).toFixed(2)}/mo</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Fast Shipping Row */}
              <div className="review-shipping-row">
                <div className="review-shipping-left">
                  <span className="review-shipping-icon-wrap">
                    <ShippingIcon className="review-shipping-icon" />
                  </span>
                  <span className="review-shipping-name">{shipping.name}</span>
                </div>
                <div className="review-shipping-pricing">
                  <span className="review-item-old-price">${shipping.oldPrice.toFixed(2)}</span>
                  <span className="review-item-price review-item-price--free">FREE</span>
                </div>
              </div>
            </div>
          </div>

          <div className="review-footer-summary">
            <div className="review-guarantee-and-pricing">
              <div className="review-guarantee-left">
                <div className="review-guarantee-badge-wrap">
                  <img src={guaranteeBadgeImg} alt="100% Wyze Satisfaction Guarantee" className="review-guarantee-badge-img" />
                </div>
                <div className="review-returns-info">
                  <h4 className="review-returns-title">30-day hassle-free returns</h4>
                  <p className="review-returns-text">
                    If you're not totally in love with the product, we will refund you 100%.
                  </p>
                </div>
              </div>
              <div className="review-pricing-block">
                <div className="review-financing-tag-wrap">
                  <span className="review-financing-tag">as low as $19.19/mo</span>
                </div>
                <div className="review-totals-row">
                  {oldTotal > total && (
                    <span className="review-old-total">${oldTotal.toFixed(2)}</span>
                  )}
                  <span className="review-final-total">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {savings > 0 && (
              <div className="review-savings-banner">
                Congrats! You're saving ${savings.toFixed(2)} on your security bundle!
              </div>
            )}

            <button type="button" className="review-checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>

            <div className="review-save-later-wrap">
              <button type="button" className="review-save-later-btn" onClick={handleSave}>
                Save my system for later
              </button>
              {saveMessage && (
                <div className="review-saved-badge" role="status" aria-live="polite">
                  <span className="review-saved-check">✓</span> {saveMessage}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
