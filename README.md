# Frontend Take-Home: Bundle Builder

A multi-step bundle builder for a home security system. The shopper picks cameras, a plan, sensors and extras in a 4-step accordion, and a live review panel shows the system, quantities and total.

## Tech stack

- React 19
- Vite
- JavaScript
- Plain CSS (no UI library)

## Run instructions

Requires Node.js 20.19+ or 22+ (tested on Node 22).

```bash
npm install
npm run dev      # starts the dev server, usually at http://localhost:5173
```

Other commands:

```bash
npm run build    # production build into dist/
npm run preview  # serve the production build locally
npm run lint     # oxlint
```

## Features

- 4-step accordion. Step 1 is open on load, and each step has a "Next:" button.
- "N selected" counter per step. It counts distinct products, not units and not variants.
- Product cards with an optional badge, "Learn More" link, color/variant selector, quantity stepper and pricing.
- Independent quantity per variant. For example, 2 White and 1 Grey Cam v4 are tracked separately.
- The card stepper is tied to the currently selected color. The review panel lists every variant with a count above zero as its own line.
- Live review panel with quantity steppers that stay in sync with the cards, plus savings and total.
- Required item: the Sense Hub is locked at quantity 1 on both the card and the review panel.
- "Save my system for later" stores the configuration in `localStorage`. It is restored when the page loads.
- Responsive layout for desktop, tablet and phone, with no horizontal scrolling.
- The app is data-driven from `src/data/products.json`, including the initial state.

## Project structure

```
src/
├── assets/          # Product images and icons
├── components/
│   ├── Accordion.jsx
│   ├── BundleBuilder.jsx   # state, save/restore, step content
│   ├── Icons.jsx
│   ├── ProductCard.jsx
│   ├── QuantityControl.jsx
│   └── ReviewPanel.jsx
├── data/            # products.json (products, plans, shipping, initial state)
├── styles/          # Plain CSS per area (layout, accordion, product-card, review, plan-card)
├── utils/           # Image lookup helper
├── App.jsx
└── main.jsx
public/figma/        # Design reference images
```

## Implementation Decisions

- **State:** state is lifted into `<BundleBuilder />` using `useState`. The app is small, so I did not add Context or a reducer.
- **Variant quantities:** quantities are stored in a flat map per step, keyed by `productId-colorId` (for example `cameras: { 'wyze-cam-v4-white': 1 }`). Products without colors use just `productId`. The cards, the review panel, the "N selected" counter and the total all read from this one map.
- **Data-driven UI:** all product data comes from `products.json`. Required items are marked with `isRequired` in the data, not in the components.
- **Persistence:** the saved system is read once when the app starts. If the saved data is missing or invalid, the app falls back to the initial state from `products.json`.
- **Responsive layout:** plain CSS media queries for desktop, tablet and phone.
- **Shared controls:** `<QuantityControl />` is used by both the product cards and the review panel.

## Implementation Notes

- **Pan v3 pricing:** Wyze Cam Pan v3 shows $34.98 on the card but $23.99 per unit in the review panel. The design's review totals only add up with the lower price, so `products.json` has separate `reviewPrice` / `reviewOldPrice` values.
- **Placeholder images:** some images (Black/Grey variants, doorbell, hub, motion sensor, microSD) are simple placeholder SVGs, not the real photos from the design.
- **Steps 2 to 4:** the design only shows Step 1 expanded, so the plan, sensor and extras cards were designed by me, following the Step 1 style.
- **Variant key format:** the `productId-colorId` key is split on the last `-` to find the color, so color ids must not contain a hyphen. A nested `{ productId: { colorId: qty } }` shape would be cleaner.
- **Saving is manual:** the system is only saved when "Save my system for later" is clicked. There is one saved slot and no "clear" option.
- **Checkout:** this is a placeholder that shows a confirmation alert, as allowed by the brief.
- **"Learn More" links:** they point to wyze.com as placeholders.
- **Fonts:** loaded from Google Fonts, so they need an internet connection.
- **Testing:** there are no automated tests. I checked the behavior manually at desktop, tablet and phone widths.

