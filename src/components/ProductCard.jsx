import QuantityControl from './QuantityControl';
import { getProductImage } from '../utils/imageHelper';
import '../styles/product-card.css';

export default function ProductCard({ 
  product, 
  stepId, 
  configuration, 
  onIncrease, 
  onDecrease, 
  onSelectColor 
}) {
  // Active color chip from state or fallback to first color
  const selectedColorId =
    configuration.selectedColors?.[product.id] || product.colors?.[0]?.id || null;

  // Stepper shows and changes the quantity of the currently selected color only
  const key = selectedColorId ? `${product.id}-${selectedColorId}` : product.id;
  const currentColorQuantity = configuration[stepId]?.[key] || 0;

  // A card with ANY quantity above 0 across any of its colors is in the selected style
  const group = configuration[stepId] || {};
  let totalProductQuantity = 0;
  for (const k in group) {
    if (k === product.id || k.startsWith(`${product.id}-`)) {
      totalProductQuantity += group[k];
    }
  }
  const isSelected = totalProductQuantity > 0;

  // Find image for active color
  const activeColor = product.colors?.find((c) => c.id === selectedColorId);
  const rawImage = activeColor?.image || product.image;
  const displayImage = getProductImage(rawImage);

  const handleColorClick = (colorId) => {
    onSelectColor(product.id, colorId);
  };

  const handleIncrement = () => {
    onIncrease(stepId, product.id, selectedColorId);
  };

  const handleDecrement = () => {
    onDecrease(stepId, product.id, selectedColorId);
  };

  return (
    <div
      className={`product-card ${isSelected ? 'product-card--selected' : ''}`}
      data-product-id={product.id}
    >
      {/* Optional Badge */}
      {product.badge && (
        <span className="product-card-badge">{product.badge}</span>
      )}

      {/* Left Column: Image */}
      <div className="product-card-left">
        <div className="product-card-image-wrap">
          <img
            src={displayImage}
            alt={`${product.name}${activeColor ? ` in ${activeColor.label}` : ''}`}
            className="product-card-image"
            loading="lazy"
          />
        </div>
      </div>

      {/* Right Column: Title, Description, Color Chips, Stepper & Price */}
      <div className="product-card-right">
        <div className="product-card-info">
          <h3 className="product-card-title">{product.name}</h3>
          <p className="product-card-description">
            {product.description}{' '}
            {product.learnMoreUrl && (
              <a
                href={product.learnMoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="product-card-learn-more"
              >
                Learn More
              </a>
            )}
          </p>
        </div>

        {/* Color Chips: each chip shows small product image plus label */}
        {product.colors && product.colors.length > 0 && (
          <div className="product-card-colors" aria-label="Available colors">
            {product.colors.map((color) => {
              const isChipActive = selectedColorId === color.id;
              const chipImg = getProductImage(color.image);
              return (
                <button
                  key={color.id}
                  type="button"
                  className={`color-chip ${isChipActive ? 'color-chip--active' : ''}`}
                  onClick={() => handleColorClick(color.id)}
                  title={color.label}
                >
                  <img
                    src={chipImg}
                    alt=""
                    className="color-chip-img"
                    aria-hidden="true"
                  />
                  <span className="color-label">{color.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Row: Stepper and Pricing */}
        <div className="product-card-footer">
          {/* Stepper */}
          <QuantityControl 
            quantity={currentColorQuantity}
            onIncrease={handleIncrement}
            onDecrease={handleDecrement}
            ariaLabel={product.name}
            disabled={product.isRequired}
          />

          {/* Pricing: old price red on top, current price normal weight in grey */}
          <div className="product-card-pricing">
            {product.oldPrice && (
              <span className="product-card-old-price">
                ${product.oldPrice.toFixed(2)}
              </span>
            )}
            <span className="product-card-price">
              ${product.price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
